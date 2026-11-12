import { randomUUID } from "node:crypto";
import { sanityWriteClient } from "./client.js";

/* An enquiry from the site. The id sits under a path ("message.<uuid>"):
   Sanity never returns such documents to public (tokenless) queries, so
   names, emails and phone numbers stay private although the dataset is
   public for the site's content. */
export async function createMessage({ email, text, page }) {
  const doc = await sanityWriteClient.create({
    _id: `message.${randomUUID()}`,
    _type: "message",
    email,
    text,
    page: page || undefined,
    sentAt: new Date().toISOString(),
  });
  return { id: doc._id };
}
