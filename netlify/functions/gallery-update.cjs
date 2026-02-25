const { connectLambda, getStore } = require("@netlify/blobs");

function normalizeCategory(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 60);
}

exports.handler = async (event) => {
  try {
    connectLambda(event);

    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const pass =
      event.headers?.["x-upload-password"] ||
      event.headers?.["X-Upload-Password"];

    if (!pass || pass !== process.env.UPLOAD_PASSWORD) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    const body = JSON.parse(event.body || "{}");
    const { id, caption, category } = body;

    if (!id) return { statusCode: 400, body: "Missing id" };

    const store = getStore("gallery");
    const key = "gallery.json";

    const raw = (await store.get(key)) || "[]";
    const items = (() => {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    const idx = items.findIndex((it) => it && it.id === id);
    if (idx === -1) return { statusCode: 404, body: "Not found" };

    const next = { ...items[idx] };
    if (typeof caption === "string") next.caption = caption;
    if (typeof category !== "undefined") next.category = normalizeCategory(category);

    next.updatedAt = new Date().toISOString();
    items[idx] = next;

    await store.set(key, JSON.stringify(items));

    // Keep categories list updated (only additive)
    const cat = next.category;
    if (cat) {
      const catKey = "categories.json";
      const catsRaw = (await store.get(catKey)) || "[]";
      let cats = [];
      try {
        cats = JSON.parse(catsRaw);
        if (!Array.isArray(cats)) cats = [];
      } catch {
        cats = [];
      }
      if (!cats.includes(cat)) {
        cats.push(cat);
        cats.sort((a, b) => a.localeCompare(b, "nl", { sensitivity: "base" }));
        await store.set(catKey, JSON.stringify(cats));
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    };
  } catch (e) {
    return { statusCode: 500, body: `Server error: ${String(e)}` };
  }
};
