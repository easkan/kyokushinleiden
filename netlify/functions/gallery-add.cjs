const { connectLambda, getStore } = require("@netlify/blobs");

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
    const { publicId, imageUrl, caption, category } = body;

    if (!publicId || !imageUrl) {
      return { statusCode: 400, body: "Missing publicId or imageUrl" };
    }

    const store = getStore("gallery");
    const key = "gallery.json";

    const existingRaw = (await store.get(key)) || "[]";
    let items = [];
    try {
      items = JSON.parse(existingRaw);
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }

    const item = {
      id: (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
      publicId,
      imageUrl,
      caption: typeof caption === "string" ? caption : "",
      category: typeof category === "string" ? category.trim().replace(/\s+/g, " ").slice(0, 60) : "",
      createdAt: new Date().toISOString(),
    };

    items.unshift(item);
    await store.set(key, JSON.stringify(items));

    // Keep a separate list of categories for the uploader dropdown
    const cat = item.category;
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
      body: JSON.stringify(item),
    };
  } catch (e) {
    return { statusCode: 500, body: `Server error: ${String(e)}` };
  }
};