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
    <div class="gallery-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer"
         data-img="${escapeHtml(img)}">
      <img src="${escapeHtml(img)}"
           alt="${escapeHtml(caption)}"
           class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
           loading="lazy">
      ${caption ? `
        <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p class="text-white text-sm font-bold">${escapeHtml(caption)}</p>
        </div>
      ` : ""}
    </div>
  `;
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  document.addEventListener("click", function(e) {
    const card = e.target.closest(".gallery-card");
    if (card && card.dataset.img) {
      img.src = card.dataset.img;
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
    }

    if (e.target === lightbox) {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
    }
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
    }
  });
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

      if (!overflow) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        return;
      }

      prevBtn.style.display = "grid";
      nextBtn.style.display = "grid";
    };

    const scrollByPage = (dir) => {
      const amount = Math.max(240, Math.floor(viewport.clientWidth * 0.9));
      viewport.scrollBy({ left: dir * amount, behavior: "smooth" });
    };

    prevBtn.addEventListener("click", () => scrollByPage(-1));
    nextBtn.addEventListener("click", () => scrollByPage(1));
    viewport.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    update();
  }
}

async function loadGallery() {
  const container = document.getElementById("gallery-container");
  const loadingState = document.getElementById("loading-state");

  try {
    const res = await fetch("/.netlify/functions/gallery-list", { cache: "no-store" });
    const items = await res.json();

    const groups = new Map();
    const order = [];

    for (const it of items) {
      const cat = it.category?.trim() || "Ongecategoriseerd";
      if (!groups.has(cat)) {
        groups.set(cat, []);
        order.push(cat);
      }
      groups.get(cat).push(it);
    }

    container.innerHTML = order.map(cat => {
      const groupItems = groups.get(cat);

      return `
        <section>
          <h2 class="text-2xl font-black mb-6">${escapeHtml(cat)}</h2>
          <div class="gallery-carousel" data-carousel>
            <button class="carousel-btn" data-carousel-prev>‹</button>
            <div class="carousel-viewport" data-carousel-viewport>
              <div class="carousel-track">
                ${groupItems.map(renderItem).join("")}
              </div>
            </div>
            <button class="carousel-btn" data-carousel-next>›</button>
          </div>
        </section>
      `;
    }).join("");

    setupCarousels(container);
    setupLightbox();

    if (loadingState) loadingState.remove();

  } catch (error) {
    container.innerHTML = "<p>Kon galerij niet laden.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadGallery);