import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { imageUrl, caption, password } = await req.json();

    if (password !== process.env.UPLOAD_PASSWORD) {
      return new Response("Unauthorized", { status: 401 });
    }

    const store = getStore("gallery");
    const id = Date.now().toString();
    const newItem = {
      id,
      imageUrl,
      caption,
      createdAt: new Date().toISOString(),
    };

    // Get current list
    const currentData = await store.get("items", { type: "json" }) || [];
    const updatedData = [newItem, ...(currentData as any[])];

    await store.setJSON("items", updatedData);

    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
