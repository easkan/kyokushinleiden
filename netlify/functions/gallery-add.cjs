import { connectLambda, getStore } from "@netlify/blobs";

export async function handler(event) {
  // 👇 belangrijk: init Blobs context in Lambda mode
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
  const { publicId, imageUrl, caption } = body;

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
    id: crypto.randomUUID(),
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
}