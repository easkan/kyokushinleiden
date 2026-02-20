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
    const { id } = body;

    if (!id) {
      return { statusCode: 400, body: "Missing id" };
    }

    const store = getStore("gallery");
    const key = "gallery.json";

    const raw = (await store.get(key)) || "[]";
    let items = [];
    try {
      const parsed = JSON.parse(raw);
      items = Array.isArray(parsed) ? parsed : [];
    } catch {
      items = [];
    }

    const next = items.filter((it) => it.id !== id);
    await store.set(key, JSON.stringify(next));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return { statusCode: 500, body: "Server error: " + String(e) };
  }
};