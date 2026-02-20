const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const store = getStore("gallery");
    const key = "gallery.json";

    const raw = (await store.get(key)) || "[]";
    let items = [];
    try {
      items = JSON.parse(raw);
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    };
  } catch (e) {
    return { statusCode: 500, body: `Server error: ${String(e)}` };
  }
};
