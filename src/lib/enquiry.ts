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

export function validateEnquiry(f: Enquiry): EnquiryErrors {
  const e: EnquiryErrors = {};
  const name = f.name.trim();
  if (name.length < 2) e.name = "Please enter your name.";
  else if (name.length > 80) e.name = "Name is too long.";
  if (!/^[6-9]\d{9}$/.test(normalisePhone(f.phone))) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (f.email.trim() && (f.email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())))
    e.email = "Enter a valid email address.";
  if (!services.some((s) => s.title === f.service)) e.service = "Please choose a service.";
  if (f.guards.trim() && !/^\d{1,5}$/.test(f.guards.trim())) e.guards = "Enter a number.";
  if (f.company.length > 120) e.company = "Too long.";
  if (f.location.length > 120) e.location = "Too long.";
  if (f.message.length > 2000) e.message = "Please keep your message under 2000 characters.";
  return e;
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
