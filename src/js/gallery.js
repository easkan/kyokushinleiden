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

function showNext() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  document.getElementById("lightbox-img").src = currentImages[currentIndex];
}

function showPrev() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  document.getElementById("lightbox-img").src = currentImages[currentIndex];
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.add("hidden");
  lightbox.classList.remove("flex");
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  document.addEventListener("click", function(e) {

    const card = e.target.closest(".gallery-card");
    if (card) {
      const section = card.closest(".category");
      const cards = Array.from(section.querySelectorAll(".gallery-card"));

      currentImages = cards.map(c => c.querySelector("img").src);
      currentIndex = cards.indexOf(card);

      img.src = currentImages[currentIndex];

      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
      return;
    }

    if (e.target === lightbox) closeLightbox();
  });

  document.getElementById("nextBtn").addEventListener("click", showNext);
  document.getElementById("prevBtn").addEventListener("click", showPrev);

  document.addEventListener("keydown", function(e) {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

async function loadGallery() {
  const container = document.getElementById("gallery-container");

  const res = await fetch("/.netlify/functions/gallery-list");
  const items = await res.json();

  const groups = {};
  items.forEach(item => {
    const cat = item.category?.trim() || "Ongecategoriseerd";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });

  container.innerHTML = Object.keys(groups).map(cat => {
    return `
      <div class="category mb-10">
        <div class="category-header text-2xl font-bold">
          <span>${escapeHtml(cat)}</span>
          <span class="chevron">⌄</span>
        </div>
        <div class="gallery-grid hidden">
          ${groups[cat].map(item => `
            <div class="gallery-card">
              <img src="${escapeHtml(item.imageUrl || item.image || "")}" loading="lazy">
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".category-header").forEach(header => {
    header.addEventListener("click", () => {
      const category = header.parentElement;
      const grid = category.querySelector(".gallery-grid");
      category.classList.toggle("open");
      grid.classList.toggle("hidden");
    });
  });

  setupLightbox();
}

document.addEventListener("DOMContentLoaded", loadGallery);
