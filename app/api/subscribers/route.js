import { createSubscriber } from "../../../lib/subscribers.js";

const EMAIL_MAX_LENGTH = 254;

function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim();
  if (!email || email.length > EMAIL_MAX_LENGTH) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot field: humans never fill it. Pretend success so bots move on.
  if (
    typeof payload?.data?.company === "string" &&
    payload.data.company.trim()
  ) {
    return Response.json({ ok: true }, { status: 201 });
  }

  const email = normalizeEmail(payload?.data?.email);
  if (!email) {
    return Response.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  try {
    const data = await createSubscriber(email);
    return Response.json(data, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create subscriber.";
    return Response.json({ error: message }, { status: 502 });
  }
}
