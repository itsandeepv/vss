import { business } from "@/content/site";
import type { Enquiry } from "@/lib/enquiry";

/**
 * Branded email templates. Email clients (Gmail, Outlook, phone apps) ignore most modern CSS,
 * so these use table layout + inline styles. The logo is attached inline as cid:vss-logo.
 * Every user-supplied value is HTML-escaped.
 */

const NAVY = "#0b1324";
const NAVY2 = "#121d36";
const GOLD = "#ffcc00";
const BLUE = "#1f3fd1";
const INK = "#0f172a";
const MUTED = "#586273";
const LINE = "#e2e7ef";
const BG = "#eef1f6";
const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const LOGO_CID = "vss-logo";

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const dash = (v: string) => (v.trim() ? v : "—");

export type EnquiryMeta = { submittedAt: string; pageUrl: string; ip?: string };

/** Values shared by both templates. */
function view(e: Enquiry) {
  const phoneDisplay = `+91 ${e.phone.slice(0, 5)} ${e.phone.slice(5)}`;
  return {
    phoneDisplay,
    tel: `tel:+91${e.phone}`,
    wa: `https://wa.me/91${e.phone}?text=${encodeURIComponent(`Hello ${e.name}, this is ${business.name} regarding your enquiry for ${e.service}.`)}`,
    mailto: e.email ? `mailto:${e.email}?subject=${encodeURIComponent(`Re: Your enquiry for ${e.service} – ${business.name}`)}` : "",
  };
}

function button(href: string, label: string, bg: string, color: string) {
  // "Bulletproof" button: works in Outlook too.
  return `<td style="padding:4px 6px 4px 0;" valign="top">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="${bg}" style="border-radius:8px;">
        <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:12px 18px;font-family:${FONT};font-size:14px;font-weight:700;color:${color};text-decoration:none;border-radius:8px;">${label}</a>
      </td>
    </tr></table>
  </td>`;
}

function shell({ preheader, body, footer }: { preheader: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(business.name)}</title>
<style>
  @media (max-width:620px){ .container{width:100%!important} .px{padding-left:20px!important;padding-right:20px!important} .stack td{display:block!important;width:100%!important} }
  a{color:${BLUE}}
</style>
</head>
<body style="margin:0;padding:0;background:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BG};">${esc(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
    <!-- Header -->
    <tr><td bgcolor="${NAVY}" style="background:${NAVY};border-radius:14px 14px 0 0;padding:22px 28px;" class="px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle" style="padding-right:14px;"><img src="cid:${LOGO_CID}" width="46" height="55" alt="VSS" style="display:block;border:0;width:46px;height:auto;"></td>
        <td valign="middle" style="font-family:${FONT};">
          <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:.3px;">Vanshika Security Service</div>
          <div style="font-size:11px;font-weight:700;color:${GOLD};letter-spacing:2px;text-transform:uppercase;padding-top:3px;">PSARA Licensed Security &amp; Manpower</div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="font-size:0;line-height:0;" height="4">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td width="35%" height="4" bgcolor="${GOLD}" style="font-size:0;line-height:0;">&nbsp;</td>
        <td width="65%" height="4" bgcolor="${BLUE}" style="font-size:0;line-height:0;">&nbsp;</td>
      </tr></table>
    </td></tr>
    <!-- Body -->
    <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:30px 28px 28px;font-family:${FONT};color:${INK};" class="px">
      ${body}
    </td></tr>
    <!-- Footer -->
    <tr><td bgcolor="${NAVY2}" style="background:${NAVY2};border-radius:0 0 14px 14px;padding:20px 28px;font-family:${FONT};font-size:12px;line-height:1.6;color:#b4bdcf;" class="px">
      ${footer}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function rows(items: [string, string][]) {
  return items
    .map(
      ([k, v], i) => `<tr>
        <td width="38%" valign="top" style="padding:11px 14px;background:${i % 2 ? "#ffffff" : "#f6f8fc"};border-bottom:1px solid ${LINE};font-size:13px;font-weight:700;color:${MUTED};">${k}</td>
        <td valign="top" style="padding:11px 14px;background:${i % 2 ? "#ffffff" : "#f6f8fc"};border-bottom:1px solid ${LINE};font-size:14px;color:${INK};">${v}</td>
      </tr>`,
    )
    .join("");
}

/* ------------------------------------------------------------------ */
/* 1. Enquiry notification → business inbox                            */
/* ------------------------------------------------------------------ */

export function enquirySubject(e: Enquiry) {
  return `New Enquiry – ${e.service} – ${e.name}`;
}

export function enquiryHtml(e: Enquiry, meta: EnquiryMeta) {
  const v = view(e);
  const buttons = [
    button(v.tel, `&#128222;&nbsp; Call ${esc(v.phoneDisplay)}`, GOLD, NAVY),
    button(v.wa, "WhatsApp", "#0f7a45", "#ffffff"),
    v.mailto ? button(v.mailto, "Reply by Email", NAVY, "#ffffff") : "",
  ].join("");

  const body = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="#fff6cc" style="background:#fff6cc;border:1px solid ${GOLD};border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;letter-spacing:1.5px;color:#6b5200;text-transform:uppercase;">New website enquiry</td>
    </tr></table>
    <h1 style="margin:16px 0 6px;font-size:24px;line-height:1.3;font-weight:800;color:${INK};">${esc(e.name)} needs <span style="color:${BLUE};">${esc(e.service)}</span></h1>
    <p style="margin:0 0 20px;font-size:13px;color:${MUTED};">Received ${esc(meta.submittedAt)}${e.location ? ` &middot; ${esc(e.location)}` : ""}</p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="stack"><tr>${buttons}</tr></table>

    <h2 style="margin:28px 0 10px;font-size:15px;font-weight:800;color:${INK};">Enquiry details</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${LINE};border-radius:10px;border-collapse:separate;overflow:hidden;">
      ${rows([
        ["Name", esc(e.name)],
        ["Phone", `<a href="${v.tel}" style="color:${BLUE};font-weight:700;text-decoration:none;">${esc(v.phoneDisplay)}</a>`],
        ["Email", e.email ? `<a href="mailto:${esc(e.email)}" style="color:${BLUE};text-decoration:none;">${esc(e.email)}</a>` : "—"],
        ["Service required", `<strong>${esc(e.service)}</strong>`],
        ["Number of guards", esc(dash(e.guards))],
        ["Company / Site", esc(dash(e.company))],
        ["Location", esc(dash(e.location))],
      ])}
    </table>

    <h2 style="margin:24px 0 10px;font-size:15px;font-weight:800;color:${INK};">Message</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="#f6f8fc" style="background:#f6f8fc;border-left:4px solid ${GOLD};border-radius:6px;padding:14px 16px;font-size:14px;line-height:1.6;color:${INK};white-space:pre-wrap;">${esc(dash(e.message))}</td>
    </tr></table>

    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${MUTED};">
      Tip: reply to this email to answer ${e.email ? esc(e.name) + " directly" : "— no email was given, so please call back"}.
    </p>`;

  const footer = `
    Sent from the contact form on <a href="${esc(meta.pageUrl)}" style="color:${GOLD};text-decoration:none;">${esc(meta.pageUrl)}</a><br>
    ${esc(business.name)} &middot; ${esc(business.address.full)}`;

  return shell({ preheader: `${e.name} · ${v.phoneDisplay} · ${e.service}${e.location ? " · " + e.location : ""}`, body, footer });
}

export function enquiryText(e: Enquiry, meta: EnquiryMeta) {
  const v = view(e);
  return [
    `NEW WEBSITE ENQUIRY — ${business.name}`,
    "",
    `Name:             ${e.name}`,
    `Phone:            ${v.phoneDisplay}`,
    `Email:            ${dash(e.email)}`,
    `Service required: ${e.service}`,
    `Number of guards: ${dash(e.guards)}`,
    `Company / Site:   ${dash(e.company)}`,
    `Location:         ${dash(e.location)}`,
    "",
    "Message:",
    dash(e.message),
    "",
    `Call: ${v.tel}   WhatsApp: ${v.wa}`,
    "",
    `Received ${meta.submittedAt} from ${meta.pageUrl}`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* 2. Auto-reply → customer (only when they gave an email)             */
/* ------------------------------------------------------------------ */

export function autoReplySubject() {
  return `We've received your enquiry – ${business.name}`;
}

export function autoReplyHtml(e: Enquiry) {
  const [sales] = business.phones;
  const steps = [
    ["1", "We call you", "A member of our team will call you back to understand your requirement."],
    ["2", "Site survey", "We visit your site to assess risks, entry points and manpower needs."],
    ["3", "Plan &amp; quote", "You receive a clear deployment plan with posts, shifts and a quotation."],
  ]
    .map(
      ([n, t, d]) => `<tr>
        <td width="44" valign="top" style="padding:0 0 14px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td width="32" height="32" align="center" valign="middle" bgcolor="${NAVY}" style="border-radius:16px;font-size:14px;font-weight:800;color:${GOLD};">${n}</td>
          </tr></table>
        </td>
        <td valign="top" style="padding:4px 0 14px;font-size:14px;line-height:1.5;color:${INK};"><strong>${t}</strong><br><span style="color:${MUTED};">${d}</span></td>
      </tr>`,
    )
    .join("");

  const body = `
    <h1 style="margin:0 0 10px;font-size:24px;line-height:1.3;font-weight:800;color:${INK};">Thank you, ${esc(e.name)}!</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${INK};">
      We've received your enquiry for <strong>${esc(e.service)}</strong>. Our team will call you back shortly on <strong>${esc(view(e).phoneDisplay)}</strong>.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${LINE};border-radius:10px;border-collapse:separate;overflow:hidden;">
      ${rows([
        ["Service", esc(e.service)],
        ["Location", esc(dash(e.location))],
        ["Number of guards", esc(dash(e.guards))],
      ])}
    </table>

    <h2 style="margin:26px 0 14px;font-size:15px;font-weight:800;color:${INK};">What happens next</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps}</table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;"><tr>
      <td bgcolor="${NAVY}" style="background:${NAVY};border-radius:12px;padding:18px 20px;font-size:14px;line-height:1.7;color:#e8ecf4;">
        <strong style="color:${GOLD};">Need us urgently?</strong><br>
        Call / WhatsApp: <a href="tel:${sales.tel}" style="color:#ffffff;font-weight:700;text-decoration:none;">${esc(sales.display)}</a><br>
        Email: <a href="mailto:${business.email}" style="color:#ffffff;text-decoration:none;">${esc(business.email)}</a>
      </td>
    </tr></table>

    <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:${INK};">Regards,<br><strong>Team ${esc(business.name)}</strong><br><span style="color:${MUTED};">${esc(business.tagline)}</span></p>`;

  const footer = `
    ${esc(business.name)} (VSS) &middot; PSARA licensed security agency<br>
    ${esc(business.address.full)}<br>
    You're receiving this because you submitted an enquiry on our website.`;

  return shell({ preheader: `We'll call you back shortly about ${e.service}.`, body, footer });
}

export function autoReplyText(e: Enquiry) {
  const [sales] = business.phones;
  return [
    `Dear ${e.name},`,
    "",
    `Thank you for contacting ${business.name}. We've received your enquiry for ${e.service} and our team will call you back shortly on ${view(e).phoneDisplay}.`,
    "",
    "What happens next: 1) we call you  2) site survey  3) deployment plan & quote.",
    "",
    `Need us urgently? Call / WhatsApp ${sales.display} · ${business.email}`,
    "",
    `Regards,\nTeam ${business.name}\n${business.address.full}`,
  ].join("\n");
}
