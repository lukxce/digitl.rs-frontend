import { sanityWriteClient } from "./client.js";

export async function createSubscriber(email) {
  return sanityWriteClient.create({
    _type: "subscriber",
    email,
    subscribedAt: new Date().toISOString(),
  });
}
