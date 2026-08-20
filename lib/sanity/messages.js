import { sanityWriteClient } from "./client.js";

export async function createMessage({ email, text }) {
  return sanityWriteClient.create({
    _type: "message",
    email,
    text,
    sentAt: new Date().toISOString(),
  });
}
