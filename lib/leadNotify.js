/* Sends a new enquiry by email through Resend, from sajtovi@digitl.rs to
   LEAD_NOTIFY_EMAIL, with the customer's address as reply-to, so a reply
   from the inbox goes straight to them. Same setup as the rank sites.
   Without RESEND_API_KEY it does nothing and the enquiry is only saved. */

const FROM = "Digitl sajt <sajtovi@digitl.rs>";

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function notifyLead({ email, text, page }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return { sent: false, reason: "not configured" };
  const first = text.split("\n")[0] || "Upit";
  const subject = `${first} · ${email}`.slice(0, 140);
  const rows = text
    .split("\n")
    .map((l) => `<p style="margin:0 0 6px">${esc(l)}</p>`)
    .join("");
  const html =
    `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#0b0b16">` +
    `<p style="margin:0 0 12px"><b>Novi upit sa digitl.rs</b></p>${rows}` +
    `<p style="margin:16px 0 0;color:#575764">Mejl: ${esc(email)}${page ? `<br>Strana: ${esc(page)}` : ""}</p>` +
    `<p style="margin:8px 0 0;color:#85858f">Odgovor na ovaj mejl ide direktno pošiljaocu.</p></div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: to
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      reply_to: email,
      subject,
      html,
      text: `${text}\n\nMejl: ${email}${page ? `\nStrana: ${page}` : ""}`,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
  }
  return { sent: true };
}
