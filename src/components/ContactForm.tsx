"use client";

import { useEffect, useRef, useState } from "react";
import { business, services, whatsappHref } from "@/content/site";
import { normalisePhone, validateEnquiry, type Enquiry, type EnquiryErrors } from "@/lib/enquiry";
import { Icon } from "./Icon";

/**
 * Enquiry form. Posts JSON to /api/enquiry/, which validates again on the server and emails the
 * enquiry over SMTP (see src/app/api/enquiry/route.ts). SMTP credentials stay on the server.
 *
 * Spam protection: hidden honeypot field, a signed time token fetched on load (server rejects
 * submissions < 3 s after it was issued), and a per-IP rate limit on the server.
 */

const API = "/api/enquiry/";

type Fields = Enquiry;
type Errors = EnquiryErrors;
type Status = { kind: "idle" | "sending" | "success" | "error"; message?: string };

const empty: Fields = { name: "", phone: "", email: "", company: "", location: "", service: "", guards: "", message: "" };

async function fetchToken() {
  try {
    const r = await fetch(API, { cache: "no-store" });
    return ((await r.json()) as { token?: string }).token || "";
  } catch {
    return "";
  }
}

export function ContactForm({ defaultService = "" }: { defaultService?: string }) {
  const [fields, setFields] = useState<Fields>({ ...empty, service: defaultService });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const token = useRef<Promise<string> | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Ask the server for a time-stamped token as soon as the form mounts.
  useEffect(() => {
    token.current = fetchToken();
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const focusFirst = (errs: Errors) => {
    const first = (Object.keys(errs) as (keyof Fields)[]).find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    return Boolean(first);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;

    const botcheck = String(new FormData(e.currentTarget).get("botcheck") || "");
    const errs = validateEnquiry(fields);
    setErrors(errs);
    if (focusFirst(errs)) return;

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...fields,
          phone: normalisePhone(fields.phone),
          botcheck,
          token: await (token.current ?? fetchToken()),
          page: window.location.href,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: Errors };
      if (data.errors) {
        setErrors(data.errors);
        focusFirst(data.errors);
      }
      // "Too fast"/expired tokens: get a fresh one so the next attempt can succeed.
      if (res.status === 429 || res.status === 400) token.current = fetchToken();
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: `${data.message || "We couldn't send your enquiry right now."} You can also call ${business.phones[0].display} or message us on WhatsApp.`,
        });
        return;
      }
      const name = fields.name.trim();
      setFields(empty);
      token.current = fetchToken();
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
