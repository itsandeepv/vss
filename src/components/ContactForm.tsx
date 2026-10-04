"use client";

import { useEffect, useRef, useState } from "react";
import { business, services, whatsappHref } from "@/content/site";
import { Icon } from "./Icon";

/**
 * Enquiry form for a static site. Submissions go to Web3Forms (https://web3forms.com),
 * which emails them to the address registered with the access key. No SMTP credentials
 * ever reach the browser: the access key only identifies the inbox and is designed to be public.
 *
 * Spam protection (all client-side because there is no server of our own):
 *  - hidden honeypot field (`botcheck`, also checked by Web3Forms server-side)
 *  - reject submissions made < 3 s after page load
 *  - per-browser rate limit: 5 submissions / hour (localStorage)
 * Web3Forms adds its own server-side spam filtering and rate limiting on top.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";
const MIN_FILL_MS = 3000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_KEY = "vss-enquiries";

type Fields = {
  name: string;
  phone: string;
  email: string;
  company: string;
  location: string;
  service: string;
  guards: string;
  message: string;
};
type Errors = Partial<Record<keyof Fields, string>>;
type Status = { kind: "idle" | "sending" | "success" | "error"; message?: string };

const empty: Fields = { name: "", phone: "", email: "", company: "", location: "", service: "", guards: "", message: "" };

/** Accepts "98765 43210", "+91 9876543210", "09876543210" → "9876543210". */
export function normalisePhone(v: string) {
  let d = v.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
}

function validate(f: Fields): Errors {
  const e: Errors = {};
  const name = f.name.trim();
  if (name.length < 2) e.name = "Please enter your name.";
  else if (name.length > 80) e.name = "Name is too long.";
  if (!/^[6-9]\d{9}$/.test(normalisePhone(f.phone))) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!services.some((s) => s.title === f.service)) e.service = "Please choose a service.";
  if (f.guards.trim() && !/^\d{1,5}$/.test(f.guards.trim())) e.guards = "Enter a number.";
  if (f.company.length > 120) e.company = "Too long.";
  if (f.location.length > 120) e.location = "Too long.";
  if (f.message.length > 2000) e.message = "Please keep your message under 2000 characters.";
  return e;
}

function recentSubmissions(): number[] {
  try {
    const list = JSON.parse(localStorage.getItem(RATE_KEY) || "[]") as number[];
    return list.filter((t) => Date.now() - t < RATE_WINDOW_MS);
  } catch {
    return [];
  }
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const loadedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;

    const fd = new FormData(e.currentTarget);
    // Honeypot filled → silently pretend success so bots learn nothing.
    if (String(fd.get("botcheck") || "")) {
      setStatus({ kind: "success", message: "Thank you! We will call you back shortly." });
      return;
    }

    const errs = validate(fields);
    setErrors(errs);
    const firstInvalid = (Object.keys(errs) as (keyof Fields)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    if (Date.now() - loadedAt.current < MIN_FILL_MS) {
      setStatus({ kind: "error", message: "That was quick! Please wait a few seconds and try again." });
      return;
    }
    const recent = recentSubmissions();
    if (recent.length >= RATE_LIMIT) {
      setStatus({
        kind: "error",
        message: `Too many enquiries from this device. Please call us on ${business.phones[0].display} instead.`,
      });
      return;
    }
    if (!ACCESS_KEY && !process.env.NEXT_PUBLIC_FORM_ENDPOINT) {
      console.warn("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set — see README.");
      setStatus({
        kind: "error",
        message: `The form is not configured yet. Please call ${business.phones[0].display} or message us on WhatsApp.`,
      });
      return;
    }

    const name = fields.name.trim();
    const phone = normalisePhone(fields.phone);
    const payload = {
      access_key: ACCESS_KEY,
      subject: `New Enquiry – ${fields.service} – ${name}`,
      from_name: "VSS Website",
      ...(fields.email.trim() ? { replyto: fields.email.trim() } : {}),
      botcheck: "",
      Name: name,
      Phone: `+91 ${phone}`,
      Email: fields.email.trim() || "—",
      "Company / Site": fields.company.trim() || "—",
      Location: fields.location.trim() || "—",
      "Service Required": fields.service,
      "Number of Guards": fields.guards.trim() || "—",
      Message: fields.message.trim() || "—",
      "Submitted From": window.location.href,
    };

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);

      try {
        localStorage.setItem(RATE_KEY, JSON.stringify([...recent, Date.now()]));
      } catch {
        /* storage unavailable — rate limit is best-effort */
      }
      setFields(empty);
      setStatus({ kind: "success", message: `Thank you, ${name}! Your enquiry has been sent. Our team will call you back shortly.` });
    } catch (err) {
      console.warn("Enquiry submission failed:", err);
      setStatus({
        kind: "error",
        message: `Sorry, we couldn't send your enquiry right now. Please call ${business.phones[0].display} or message us on WhatsApp.`,
      });
    }
  }

  useEffect(() => {
    if (status.kind === "success" || status.kind === "error") statusRef.current?.focus();
  }, [status.kind]);

  const field = (k: keyof Fields) => ({
    id: `f-${k}`,
    name: k,
    value: fields[k],
    onChange: set(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `f-${k}-err` : undefined,
  });
  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p className="field-error" id={`f-${k}-err`}>
        {errors[k]}
      </p>
    ) : null;

  return (
    <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate aria-labelledby="form-title">
      <h3 id="form-title">Request a Free Consultation</h3>
      <p className="form-intro">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required. We usually respond within one working day.
      </p>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-botcheck">Leave this empty</label>
        <input id="f-botcheck" type="text" name="botcheck" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="f-name">
            Name{" "}
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input type="text" autoComplete="name" required maxLength={80} {...field("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="f-phone">
            Phone{" "}
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            placeholder="10-digit mobile"
            maxLength={16}
            {...field("phone")}
          />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input type="email" autoComplete="email" maxLength={120} {...field("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="f-company">Company / Site name</label>
          <input type="text" autoComplete="organization" maxLength={120} {...field("company")} />
          {err("company")}
        </div>
        <div className="field">
          <label htmlFor="f-location">Location</label>
          <input type="text" autoComplete="address-level2" maxLength={120} placeholder="e.g. Manesar, Gurugram" {...field("location")} />
          {err("location")}
        </div>
        <div className="field">
          <label htmlFor="f-service">
            Service Required{" "}
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <select required {...field("service")}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
          {err("service")}
        </div>
        <div className="field">
          <label htmlFor="f-guards">Number of Guards</label>
          <input type="text" inputMode="numeric" maxLength={5} placeholder="Optional" {...field("guards")} />
          {err("guards")}
        </div>
        <div className="field field-full">
          <label htmlFor="f-message">Message</label>
          <textarea rows={4} maxLength={2000} placeholder="Tell us about your site, shifts and timelines" {...field("message")} />
          {err("message")}
        </div>
      </div>

      <button type="submit" className="btn btn-gold btn-block" disabled={status.kind === "sending"} aria-busy={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send Enquiry"}
        {status.kind !== "sending" && <Icon name="arrow-right" size={18} />}
      </button>

      <div
        ref={statusRef}
        tabIndex={-1}
        role={status.kind === "error" ? "alert" : "status"}
        className={`form-status${status.kind === "success" ? " is-success" : ""}${status.kind === "error" ? " is-error" : ""}`}
      >
        {status.message && (
          <>
            <Icon name={status.kind === "success" ? "check" : "phone"} size={18} />
            <span>
              {status.message}
              {status.kind === "error" && (
                <>
                  {" "}
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Open WhatsApp
                  </a>
                </>
              )}
            </span>
          </>
        )}
      </div>
    </form>
  );
}
