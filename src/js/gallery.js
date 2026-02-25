function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderItem(item) {
  const img = item.imageUrl || item.image || "";
  const caption = item.caption || "";
  return `
    <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <img src="${escapeHtml(img)}" alt="${escapeHtml(caption)}"
        class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
      ${caption ? `
        <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p class="text-white text-sm font-bold">${escapeHtml(caption)}</p>
        </div>
      ` : ""}
    </div>
  `;
}

async function loadGallery() {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  const loadingState = document.getElementById("loading-state");

  try {
    const res = await fetch("/.netlify/functions/gallery-list", { cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());

    const items = await res.json(); // [{id, imageUrl, caption, createdAt, publicId, category?}]
    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `
        <div class="py-20 text-center text-slate-400">
          <p class="text-xl font-bold mb-2">Nog geen foto’s</p>
          <p>Upload de eerste foto via Admin.</p>
        </div>
      `;
      if (loadingState) loadingState.style.display = "none";
      return;
    }

    // Group by category (keep order of first appearance)
    const groups = new Map();
    const order = [];
    for (const it of items) {
      const catRaw = typeof it?.category === "string" ? it.category.trim() : "";
      const cat = catRaw ? catRaw : "Ongecategoriseerd";
      if (!groups.has(cat)) {
        groups.set(cat, []);
        order.push(cat);
      }
      groups.get(cat).push(it);
    }

    container.innerHTML = order.map((cat) => {
      const groupItems = groups.get(cat) || [];
      return `
        <section>
          <div class="flex items-baseline justify-between gap-4 mb-6">
            <h2 class="text-2xl sm:text-3xl font-black tracking-tighter text-kyokushin-black">
              ${escapeHtml(cat)}
            </h2>
            <p class="text-sm font-bold uppercase tracking-widest text-slate-400">${groupItems.length} foto${groupItems.length === 1 ? "" : "’s"}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            ${groupItems.map(renderItem).join("")}
          </div>
        </section>
      `;
    }).join("");

    if (loadingState) loadingState.style.display = "none";
  } catch (error) {
    console.error("Error loading gallery:", error);
    container.innerHTML = `
      <div class="py-20 text-center text-slate-400">
        <p class="text-xl font-bold mb-2">Kon galerij niet laden</p>
        <p>${escapeHtml(String(error))}</p>
      </div>
    `;
    if (loadingState) loadingState.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", loadGallery);
