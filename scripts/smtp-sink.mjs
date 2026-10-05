/**
 * Local SMTP "catcher" for testing the contact form without sending real email:
 *
 *   npm run mail:sink        # listens on localhost:2525
 *   then run the site with MAIL_HOST=localhost MAIL_PORT=2525 MAIL_ENCRYPTION=none (no username)
 *
 * Every message is saved to .mail-sink/<time>-<subject>.html (open it in a browser to preview the
 * email exactly as designed, with the inline logo) and .eml (raw message).
 */
import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const PORT = Number(process.env.SINK_PORT || 2525);
const dir = path.resolve(import.meta.dirname, "..", ".mail-sink");
mkdirSync(dir, { recursive: true });

const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ["STARTTLS"],
  onData(stream, session, callback) {
    const chunks = [];
    stream.on("data", (c) => chunks.push(c));
    stream.on("end", async () => {
      const raw = Buffer.concat(chunks);
      const mail = await simpleParser(raw);
      // Inline cid: images as data URIs so the .html preview renders like the real email.
      let html = mail.html || `<pre>${mail.text || ""}</pre>`;
      for (const a of mail.attachments || []) {
        if (a.cid) html = html.replaceAll(`cid:${a.cid}`, `data:${a.contentType};base64,${a.content.toString("base64")}`);
      }
      const name = `${Date.now()}-${(mail.subject || "mail").replace(/[^a-z0-9]+/gi, "-").slice(0, 60)}`;
      writeFileSync(path.join(dir, `${name}.eml`), raw);
      writeFileSync(path.join(dir, `${name}.html`), html);
      console.log(`✓ ${mail.subject}  →  to: ${mail.to?.text}  reply-to: ${mail.replyTo?.text || "-"}  (${name}.html)`);
      callback();
    });
  },
});
server.listen(PORT, () => console.log(`SMTP sink on localhost:${PORT} → ${dir}`));
