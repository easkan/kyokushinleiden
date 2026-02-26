let currentImages = [];
let currentIndex = 0;

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderItem(item, index, groupImages) {
  const img = item.imageUrl || item.image || "";
  const caption = item.caption || "";

  return `
    <div class="gallery-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer"
         data-index="${index}">
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

function openLightbox(images, index) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  currentImages = images;
  currentIndex = index;

  img.src = currentImages[currentIndex];

  lightbox.classList.remove("hidden");
  lightbox.classList.add("flex");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.add("hidden");
  lightbox.classList.remove("flex");
}

function showNext() {
  if (currentImages.length === 0) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  document.getElementById("lightbox-img").src = currentImages[currentIndex];
}

function showPrev() {
  if (currentImages.length === 0) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  document.getElementById("lightbox-img").src = currentImages[currentIndex];
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");

  document.addEventListener("click", function(e) {

    // Klik op foto
    const card = e.target.closest(".gallery-card");
    if (card) {
      const section = card.closest("section");
      const cards = Array.from(section.querySelectorAll(".gallery-card"));
      const images = cards.map(c => c.querySelector("img").src);
      const index = parseInt(card.dataset.index);

      openLightbox(images, index);
      return;
    }

    // Sluiten bij klik buiten foto
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Toetsenbord
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

function setupCarousels(rootEl) {
  const carousels = rootEl.querySelectorAll("[data-carousel]");

  for (const carousel of carousels) {
    const viewport = carousel.querySelector("[data-carousel-viewport]");
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    if (!viewport || !prevBtn || !nextBtn) continue;

    const scrollByPage = (dir) => {
      const amount = Math.max(240, Math.floor(viewport.clientWidth * 0.9));
      viewport.scrollBy({ left: dir * amount, behavior: "smooth" });
    };

    prevBtn.addEventListener("click", () => scrollByPage(-1));
    nextBtn.addEventListener("click", () => scrollByPage(1));
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
      const imageList = groupItems.map(i => i.imageUrl || i.image || "");

      return `
        <section>
          <h2 class="text-2xl font-black mb-6">${escapeHtml(cat)}</h2>
          <div class="gallery-carousel" data-carousel>
            <button class="carousel-btn" data-carousel-prev>‹</button>
            <div class="carousel-viewport" data-carousel-viewport>
              <div class="carousel-track">
                ${groupItems.map((item, i) => renderItem(item, i)).join("")}
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