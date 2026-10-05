import { services } from "@/content/site";

/** Shared by the contact form (browser) and /api/enquiry (server) so both apply identical rules. */

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  company: string;
  location: string;
  service: string;
  guards: string;
  message: string;
};
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export const ENQUIRY_FIELDS: (keyof Enquiry)[] = ["name", "phone", "email", "company", "location", "service", "guards", "message"];

/** Accepts "98765 43210", "+91 9876543210", "09876543210" → "9876543210". */
export function normalisePhone(v: string) {
  let d = v.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
}

export const LIMITS = { name: 60, email: 100, company: 100, location: 100, message: 1000, guardsMax: 5000 } as const;

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PLACE_RE = /^[\p{L}\p{M}0-9 .,&()'/#-]+$/u;

/** Validates one field; returns an error message or "" when valid. Same rules run in the browser and on the server. */
export function validateField(k: keyof Enquiry, raw: string): string {
  const v = raw.trim();
  switch (k) {
    case "name": {
      if (!v) return "Please enter your name.";
      if (!NAME_RE.test(v)) return "Name can only contain letters, spaces, dots and hyphens.";
      if (v.replace(/[^\p{L}]/gu, "").length < 2) return "Please enter your full name.";
      if (v.length > LIMITS.name) return `Name must be under ${LIMITS.name} characters.`;
      return "";
    }
    case "phone": {
      if (!v) return "Please enter your mobile number.";
      if (/[^\d+\s-]/.test(v)) return "Use digits only, e.g. 98765 43210.";
      const d = normalisePhone(v);
      if (d.length !== 10) return "Mobile number must be 10 digits.";
      if (!/^[6-9]/.test(d)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
      if (/^(\d)\1{9}$/.test(d)) return "Please enter a real mobile number.";
      return "";
    }
    case "email": {
      if (!v) return "";
      if (v.length > LIMITS.email || !EMAIL_RE.test(v) || v.includes("..")) return "Enter a valid email, e.g. name@company.com.";
      return "";
    }
    case "company":
    case "location": {
      if (!v) return "";
      if (v.length > LIMITS[k]) return `Please keep this under ${LIMITS[k]} characters.`;
      if (!PLACE_RE.test(v) || !/[\p{L}]/u.test(v))
        return k === "company" ? "Enter a valid company or site name." : "Enter a valid location, e.g. Manesar, Gurugram.";
      return "";
    }
    case "service":
      return services.some((s) => s.title === v) ? "" : "Please choose the service you need.";
    case "guards": {
      if (!v) return "";
      if (!/^\d+$/.test(v)) return "Enter a number, e.g. 10.";
      const n = Number(v);
      if (n < 1 || n > LIMITS.guardsMax) return `Enter a number between 1 and ${LIMITS.guardsMax}.`;
      return "";
    }
    case "message":
      return v.length > LIMITS.message ? `Please keep your message under ${LIMITS.message} characters.` : "";
  }
}

export function validateEnquiry(f: Enquiry): EnquiryErrors {
  const e: EnquiryErrors = {};
  for (const k of ENQUIRY_FIELDS) {
    const msg = validateField(k, f[k]);
    if (msg) e[k] = msg;
  }
  return e;
}

/** Light input filtering while typing — blocks characters a field can never contain. */
export function filterInput(k: keyof Enquiry, v: string): string {
  switch (k) {
    case "name":
      return v.replace(/[^\p{L}\p{M} .'-]/gu, "").replace(/\s{2,}/g, " ");
    case "phone": {
      const cleaned = v.replace(/[^\d+\s-]/g, "");
      // Allow +91 / 0 prefixes, but never more than 10 digits after them.
      const digits = cleaned.replace(/\D/g, "");
      const max = cleaned.trim().startsWith("+") || digits.startsWith("91") ? 12 : digits.startsWith("0") ? 11 : 10;
      return digits.length > max ? cleaned.slice(0, cleaned.length - (digits.length - max)) : cleaned;
    }
    case "email":
      return v.replace(/\s/g, "");
    case "guards":
      return v.replace(/\D/g, "").slice(0, 4);
    default:
      return v;
  }
}

/** Trim, strip control characters (incl. CR/LF — no header injection) and normalise the phone. */
export function cleanEnquiry(raw: Record<string, unknown>): Enquiry {
  const str = (k: keyof Enquiry, multiline = false) => {
    const v = typeof raw[k] === "string" ? (raw[k] as string) : "";
    return (
      multiline ? v.replace(/[^\S\n]+/g, " ").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "") : v.replace(/[\u0000-\u001F\u007F]/g, " ")
    ).trim();
  };
  return {
    name: str("name"),
    phone: normalisePhone(str("phone")),
    email: str("email"),
    company: str("company"),
    location: str("location"),
    service: str("service"),
    guards: str("guards"),
    message: str("message", true),
  };
}
