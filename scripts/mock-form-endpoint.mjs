/**
 * Local stand-in for the Web3Forms API, for testing the contact form offline.
 *
 *   npm run mock:form                      # listens on http://localhost:8787/submit
 *   MOCK_FAIL=1 npm run mock:form          # every request fails (tests the error state)
 *
 * Point the site at it with NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:8787/submit
 * (see .env.example). Each submission is appended to .form-log/submissions.log and the
 * email that would be sent is written to .form-log/<timestamp>.html for inspection.
 */
import { createServer } from "node:http";
import { mkdir, appendFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.env.MOCK_PORT || 8787);
const FAIL = process.env.MOCK_FAIL === "1";
const logDir = path.resolve(import.meta.dirname, "..", ".form-log");
await mkdir(logDir, { recursive: true });

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const META = new Set(["access_key", "subject", "from_name", "replyto", "botcheck"]);

function emailHtml(d) {
  const rows = Object.entries(d)
    .filter(([k]) => !META.has(k))
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="padding:8px;background:#f4f6fb;border:1px solid #e2e7ef">${esc(k)}</th><td style="padding:8px;border:1px solid #e2e7ef">${esc(v)}</td></tr>`,
    )
    .join("");
  return `<!doctype html><meta charset="utf-8"><title>${esc(d.subject)}</title>
<p><b>Subject:</b> ${esc(d.subject)}<br><b>Reply-To:</b> ${esc(d.replyto || "(none)")}</p>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>`;
}

createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.writeHead(204).end();
  if (req.method !== "POST" || req.url !== "/submit") return res.writeHead(404).end();

  let body = "";
  for await (const chunk of req) body += chunk;
  const send = (status, json) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(json));
  };

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return send(400, { success: false, message: "Invalid JSON" });
  }
  if (FAIL) return send(500, { success: false, message: "Simulated failure (MOCK_FAIL=1)" });
  if (data.botcheck) return send(200, { success: true, message: "Spam ignored" });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await appendFile(path.join(logDir, "submissions.log"), JSON.stringify({ at: new Date().toISOString(), ...data }) + "\n");
  await writeFile(path.join(logDir, `${stamp}.html`), emailHtml(data));
  console.log(`✓ ${data.subject}`);
  send(200, { success: true, message: "Email sent successfully!" });
}).listen(PORT, () => console.log(`Mock form endpoint on http://localhost:${PORT}/submit${FAIL ? " (failing)" : ""}`));
