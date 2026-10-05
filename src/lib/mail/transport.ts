import { createTransport, type Transporter } from "nodemailer";
import { business } from "@/content/site";

/**
 * SMTP transport built from the Laravel-style MAIL_* variables in .env (server-side only —
 * none of these are NEXT_PUBLIC_, so they never reach the browser).
 *
 *   MAIL_HOST=smtp.gmail.com  MAIL_PORT=587  MAIL_ENCRYPTION=tls   (or 465 + ssl, or "none" for a local test sink)
 *   MAIL_USERNAME / MAIL_PASSWORD  (Gmail: use an App Password, not the account password)
 *   MAIL_FROM_ADDRESS        (sender address — for Gmail it must be the account itself or a verified alias)
 *   MAIL_TO_ADDRESS          (optional — where enquiries go; default: the business email in site.ts)
 *   ENQUIRY_FROM_NAME        (optional — sender display name; default "VSS Website".
 *                             MAIL_FROM_NAME is ignored on purpose: it may belong to another app)
 *   MAIL_AUTO_REPLY=true|false (optional — thank-you email to the customer. Default: on only when
 *                             the sender address is the business email, so customers never get
 *                             a reply from an unrelated mailbox)
 */
export function mailConfig() {
  const env = process.env;
  const port = Number(env.MAIL_PORT || 587);
  const enc = (env.MAIL_ENCRYPTION || (port === 465 ? "ssl" : "tls")).toLowerCase();
  const missing = ["MAIL_HOST", "MAIL_FROM_ADDRESS"].filter((k) => !env[k]);
  return {
    missing,
    transport: {
      host: env.MAIL_HOST,
      port,
      secure: enc === "ssl" || port === 465,
      requireTLS: enc === "tls",
      ignoreTLS: enc === "none",
      auth: env.MAIL_USERNAME ? { user: env.MAIL_USERNAME, pass: env.MAIL_PASSWORD || "" } : undefined,
      connectionTimeout: 15_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    },
    from: { name: env.ENQUIRY_FROM_NAME || "VSS Website", address: env.MAIL_FROM_ADDRESS || "" },
    to: env.MAIL_TO_ADDRESS || business.email,
    autoReply: env.MAIL_AUTO_REPLY
      ? env.MAIL_AUTO_REPLY === "true"
      : (env.MAIL_FROM_ADDRESS || "").toLowerCase() === business.email.toLowerCase(),
  };
}

let cached: Transporter | null = null;

export function getTransport() {
  if (!cached) cached = createTransport(mailConfig().transport);
  return cached;
}
