import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cleanEnquiry, validateEnquiry } from "@/lib/enquiry";
import { mailConfig, getTransport } from "@/lib/mail/transport";
import { LOGO_CID, autoReplyHtml, autoReplySubject, autoReplyText, enquiryHtml, enquirySubject, enquiryText } from "@/lib/mail/templates";

/**
 * POST /api/enquiry/ — validates the contact form server-side and emails it over SMTP.
 * GET  /api/enquiry/ — returns a signed timestamp token used for the "too fast" bot check.
 *
 * Spam protection: honeypot field, ≥3 s between page load (token issue) and submit,
 * token expiry (6 h), and 5 submissions / hour / IP (in-memory, per server process).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_AGE_MS = 3_000;
const MAX_AGE_MS = 6 * 60 * 60 * 1000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// Signing secret: ENQUIRY_SECRET if set, otherwise random per process (tokens reset on restart).
const SECRET = process.env.ENQUIRY_SECRET || randomBytes(32).toString("hex");
const sign = (t: string) => createHmac("sha256", SECRET).update(t).digest("hex").slice(0, 32);

const hits = new Map<string, number[]>();

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

function tokenOk(token: unknown) {
  if (typeof token !== "string" || !/^\d{13}\.[a-f0-9]{32}$/.test(token)) return "invalid";
  const [t, mac] = token.split(".");
  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(sign(t)))) return "invalid";
  const age = Date.now() - Number(t);
  if (age < MIN_AGE_MS) return "fast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}

export async function GET() {
  const t = String(Date.now());
  return json({ token: `${t}.${sign(t)}` });
}

let logo: Buffer | null | undefined;
async function logoAttachment() {
  if (logo === undefined) logo = await readFile(path.join(process.cwd(), "public", "images", "logo-email.png")).catch(() => null);
  return logo ? [{ filename: "vss-logo.png", content: logo, cid: LOGO_CID, contentType: "image/png" }] : [];
}

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  // Honeypot: pretend success so bots learn nothing.
  if (typeof raw.botcheck === "string" && raw.botcheck.trim()) return json({ ok: true });

  const tok = tokenOk(raw.token);
  if (tok === "fast") return json({ ok: false, message: "That was quick! Please wait a few seconds and try again." }, 429);
  if (tok !== "ok") return json({ ok: false, message: "Your session expired. Please reload the page and try again." }, 400);

  const ip = clientIp(req);
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    return json({ ok: false, message: "Too many enquiries from your network. Please call us instead." }, 429);
  }

  const enquiry = cleanEnquiry(raw);
  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length) return json({ ok: false, message: "Please correct the highlighted fields.", errors }, 422);

  const cfg = mailConfig();
  if (cfg.missing.length || !cfg.to) {
    console.error(`[enquiry] mail not configured — missing ${cfg.missing.join(", ") || "MAIL_TO_ADDRESS"}`);
    return json({ ok: false, message: "Our enquiry form is temporarily unavailable." }, 503);
  }

  const pageUrl =
    typeof raw.page === "string" && /^https?:\/\//.test(raw.page) ? raw.page.slice(0, 300) : req.headers.get("referer") || "website";
  const meta = {
    submittedAt: `${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST`,
    pageUrl,
  };
  const attachments = await logoAttachment();
  const transport = getTransport();

  try {
    await transport.sendMail({
      from: cfg.from,
      to: cfg.to,
      replyTo: enquiry.email ? { name: enquiry.name, address: enquiry.email } : undefined,
      subject: enquirySubject(enquiry),
      html: enquiryHtml(enquiry, meta),
      text: enquiryText(enquiry, meta),
      attachments,
    });
  } catch (err) {
    // Never log credentials — only the error message.
    console.error("[enquiry] SMTP send failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, message: "We couldn't send your enquiry right now." }, 502);
  }

  recent.push(now);
  hits.set(ip, recent);

  // Courtesy auto-reply; failure here must not fail the enquiry.
  if (enquiry.email && cfg.autoReply) {
    transport
      .sendMail({
        from: cfg.from,
        to: { name: enquiry.name, address: enquiry.email },
        replyTo: cfg.to,
        subject: autoReplySubject(),
        html: autoReplyHtml(enquiry),
        text: autoReplyText(enquiry),
        attachments,
      })
      .catch((err: unknown) => console.error("[enquiry] auto-reply failed:", err instanceof Error ? err.message : err));
  }

  return json({ ok: true });
}
