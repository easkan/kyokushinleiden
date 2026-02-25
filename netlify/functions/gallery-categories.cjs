const { connectLambda, getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    connectLambda(event);

    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const store = getStore("gallery");

    // Primary: dedicated category list
    const raw = (await store.get("categories.json")) || "[]";
    let cats = [];
    try {
      cats = JSON.parse(raw);
      if (!Array.isArray(cats)) cats = [];
    } catch {
      cats = [];
    }

    // Fallback/merge: derive from items (for older data)
    const itemsRaw = (await store.get("gallery.json")) || "[]";
    let items = [];
    try {
      items = JSON.parse(itemsRaw);
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }

    const fromItems = items
      .map((it) => (typeof it?.category === "string" ? it.category.trim() : ""))
      .filter(Boolean);

    const set = new Set(
      [...cats, ...fromItems]
        .filter((c) => typeof c === "string" && c.trim())
        .map((c) => c.trim().replace(/\s+/g, " ").slice(0, 60))
    );

    const out = Array.from(set).sort((a, b) => a.localeCompare(b, "nl", { sensitivity: "base" }));

    // Keep store in sync (so future calls are fast)
    await store.set("categories.json", JSON.stringify(out));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(out),
    };
  } catch (e) {
    return { statusCode: 500, body: `Server error: ${String(e)}` };
  }
};
