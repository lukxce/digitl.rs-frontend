/** @param {unknown} value */
function pickScalar(value) {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "object") {
    const record = value.attributes ?? value;
    if (Array.isArray(record.children)) {
      const text = record.children
        .map((child) => (typeof child?.text === "string" ? child.text : ""))
        .join("")
        .trim();
      return text.length > 0 ? text : null;
    }
    if (Array.isArray(record)) {
      const text = record
        .map((child) => pickScalar(child))
        .filter(Boolean)
        .join(" ")
        .trim();
      return text.length > 0 ? text : null;
    }
  }
  return null;
}

/** @param {Record<string, unknown>} record */
function pickKeyTakeawayTitle(record) {
  const keys = ["title", "Title", "heading", "headline", "name"];
  for (const key of keys) {
    const value = pickScalar(record[key]);
    if (value) return value;
  }
  return null;
}

/** @param {Record<string, unknown>} record */
function pickKeyTakeawayDescription(record) {
  const keys = [
    "description",
    "subtitle",
    "subTitle",
    "sub_title",
    "label",
    "caption",
    "text",
  ];
  for (const key of keys) {
    const value = pickScalar(record[key]);
    if (value) return value;
  }
  return null;
}

/** @param {unknown} item */
function normalizeKeyTakeawayItem(item) {
  if (!item || typeof item !== "object") return null;

  const record = item.attributes ?? item;
  const title = pickKeyTakeawayTitle(record);
  const description = pickKeyTakeawayDescription(record);

  if (!title && !description) return null;

  return {
    title: title ?? "",
    description: description ?? "",
  };
}

/** @param {unknown} value */
function keyTakeawayEntries(value) {
  if (value == null) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return keyTakeawayEntries(parsed);
    } catch {
      return [];
    }
  }

  if (typeof value !== "object") return [];

  const record = value.attributes ?? value;
  if (Array.isArray(record)) return record;
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.entries)) return record.entries;

  const single = normalizeKeyTakeawayItem(record);
  return single ? [single] : [];
}

/** @param {Record<string, unknown>} raw */
export function normalizeKeyTakeaways(raw) {
  const value =
    raw.keyTakeaways ?? raw.key_takeaways ?? raw["key-takeaways"] ?? null;

  return keyTakeawayEntries(value)
    .map(normalizeKeyTakeawayItem)
    .filter(Boolean);
}
