async function loadGallery() {
  const container = document.getElementById('gallery-container');
  const loadingState = document.getElementById('loading-state');

  try {
    // Fetch photos from the JSON file managed by Decap CMS
    // cache: 'no-store' ensures we get the latest version after an upload
    const response = await fetch('/data/photos.json', { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Kon foto\'s niet laden');
    }

    const data = await response.json();
    const photos = data.items || [];

    if (photos.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-20 text-center text-slate-400">
          Nog geen foto's geüpload.
        </div>
      `;
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Render photos
    photos.forEach(photo => {
      const photoCard = document.createElement('div');
      photoCard.className = 'group relative overflow-hidden rounded-xl bg-slate-200 aspect-square shadow-md hover:shadow-xl transition-all duration-300';
      
      photoCard.innerHTML = `
        <img src="${photo.image}" alt="${photo.caption || 'Karate foto'}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <p class="text-white font-medium text-sm">${photo.caption || ''}</p>
        </div>
      `;
      
      container.appendChild(photoCard);
    });

  } catch (error) {
    console.error('Gallery error:', error);
    container.innerHTML = `
      <div class="col-span-full py-20 text-center text-red-500">
        Er is een fout opgetreden bij het laden van de galerij.
      </div>
    `;
  }
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', loadGallery);
