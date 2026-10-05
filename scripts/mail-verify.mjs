/**
 * Checks the SMTP settings in .env WITHOUT sending an email:  npm run mail:verify
 * Connects, negotiates TLS and logs in — then disconnects.
 */
import { createTransport } from "nodemailer";

const env = process.env;
const port = Number(env.MAIL_PORT || 587);
const enc = (env.MAIL_ENCRYPTION || (port === 465 ? "ssl" : "tls")).toLowerCase();
const t = createTransport({
  host: env.MAIL_HOST,
  port,
  secure: enc === "ssl" || port === 465,
  requireTLS: enc === "tls",
  ignoreTLS: enc === "none",
  auth: env.MAIL_USERNAME ? { user: env.MAIL_USERNAME, pass: env.MAIL_PASSWORD || "" } : undefined,
});
console.log(`Checking ${env.MAIL_HOST}:${port} (${enc}) as ${env.MAIL_USERNAME || "(no auth)"} …`);
try {
  await t.verify();
  console.log(
    `✓ SMTP login OK. Enquiries will be sent from ${env.MAIL_FROM_ADDRESS} to ${env.MAIL_TO_ADDRESS || "vssagency05@gmail.com (default)"}.`,
  );
} catch (e) {
  console.error("✗ SMTP check failed:", e.message);
  if (/535|Username and Password not accepted|BadCredentials/i.test(e.message))
    console.error("  Gmail tip: use a 16-character App Password (Google Account → Security → 2-Step Verification → App passwords).");
  process.exit(1);
}
