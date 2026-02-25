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
    <div class="gallery-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <img src="${escapeHtml(img)}" alt="${escapeHtml(caption)}"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
      ${caption ? `
        <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p class="text-white text-sm font-bold">${escapeHtml(caption)}</p>
        </div>
      ` : ""}
    </div>
  `;
}

function setupCarousels(rootEl) {
  const carousels = rootEl.querySelectorAll("[data-carousel]");
  for (const carousel of carousels) {
    const viewport = carousel.querySelector("[data-carousel-viewport]");
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    if (!viewport || !prevBtn || !nextBtn) continue;

    const update = () => {
      const overflow = viewport.scrollWidth > viewport.clientWidth + 2;
      carousel.classList.toggle("is-overflow", overflow);

      if (!overflow) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        return;
      }

      prevBtn.style.display = "grid";
      nextBtn.style.display = "grid";
      prevBtn.disabled = viewport.scrollLeft <= 2;
      const maxScroll = viewport.scrollWidth - viewport.clientWidth - 2;
      nextBtn.disabled = viewport.scrollLeft >= maxScroll;
    };

    const scrollByPage = (dir) => {
      const amount = Math.max(240, Math.floor(viewport.clientWidth * 0.9));
      viewport.scrollBy({ left: dir * amount, behavior: "smooth" });
    };

    prevBtn.addEventListener("click", () => scrollByPage(-1));
    nextBtn.addEventListener("click", () => scrollByPage(1));
    viewport.addEventListener("scroll", () => window.requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", () => window.requestAnimationFrame(update));

    update();
  }
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
          <div class="gallery-carousel" data-carousel>
            <button class="carousel-btn" type="button" aria-label="Vorige" data-carousel-prev>
              <span aria-hidden="true">‹</span>
            </button>
            <div class="carousel-viewport" data-carousel-viewport>
              <div class="carousel-track">
                ${groupItems.map(renderItem).join("")}
              </div>
            </div>
            <button class="carousel-btn" type="button" aria-label="Volgende" data-carousel-next>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </section>
      `;
    }).join("");

    setupCarousels(container);

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
