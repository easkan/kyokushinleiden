const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const pass =
      event.headers["x-upload-password"] ||
      event.headers["X-Upload-Password"] ||
      event.headers["x-upload-password".toLowerCase()];

    if (!pass || pass !== process.env.UPLOAD_PASSWORD) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    let payload = {};
    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      payload = {};
    }

    const { publicId, imageUrl, caption } = payload;

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
      createdAt: new Date().toISOString(),
    };

    items.unshift(item);
    await store.set(key, JSON.stringify(items));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    };
  } catch (e) {
    return { statusCode: 500, body: `Server error: ${String(e)}` };
  }
};
