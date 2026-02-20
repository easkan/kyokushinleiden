async function loadGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) {
    console.error('Gallery container element not found');
    return;
  }

  const loadingState = document.getElementById('loading-state');

  try {
    const res = await fetch('/.netlify/functions/gallery-list', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const items = await res.json(); // [{id, imageUrl, caption, createdAt, publicId}]

    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-20 text-center text-slate-400">
          <p class="text-xl font-bold mb-2">Nog geen foto’s</p>
          <p>Upload de eerste foto via Admin.</p>
        </div>
      `;
      if (loadingState) loadingState.style.display = 'none';
      return;
    }

    container.innerHTML = items.map((item) => {
      const img = item.imageUrl || item.image || '';
      const caption = item.caption || '';
      return `
        <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <img src="${img}" alt="${caption}" class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          ${caption ? `
            <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p class="text-white text-sm font-bold">${caption}</p>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    if (loadingState) loadingState.style.display = 'none';
  } catch (error) {
    console.error('Error loading gallery:', error);
    container.innerHTML = `
      <div class="col-span-full py-20 text-center text-slate-400">
        <p class="text-xl font-bold mb-2">Kon galerij niet laden</p>
        <p>${String(error).replaceAll('<','&lt;').replaceAll('>','&gt;')}</p>
      </div>
    `;
    if (loadingState) loadingState.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
