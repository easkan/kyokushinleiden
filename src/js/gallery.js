async function loadGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) {
    console.error('Gallery container element not found');
    return;
  }
  
  const loadingState = document.getElementById('loading-state');

  try {
    const fetchPath = window.location.pathname.includes('admin') ? '../data/photos.json' : 'data/photos.json';
    console.log('Fetching photos from:', fetchPath);
    const response = await fetch(fetchPath);
    
    if (!response.ok) {
      console.error('Fetch failed:', response.status, response.statusText);
      throw new Error('Kon foto\'s niet laden');
    }

    const data = await response.json();
    console.log('Photos data received:', data);
    
    // Handle both { items: [] } and []
    const photos = Array.isArray(data) ? data : (data.items || []);

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
        <img src="${photo.image}" alt="${photo.caption || 'Karate foto'}" 
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
             loading="lazy"
             referrerPolicy="no-referrer">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <p class="text-white font-medium text-sm">${photo.caption || ''}</p>
        </div>
      `;
      
      container.appendChild(photoCard);
    });

  } catch (error) {
    console.error('Gallery error:', error);
    container.innerHTML = `
      <div class="col-span-full py-20 text-center">
        <p class="text-red-500 mb-4">Er is een fout opgetreden bij het laden van de galerij.</p>
        <button onclick="location.reload()" class="px-4 py-2 bg-red-700 text-white rounded-lg font-bold">Opnieuw proberen</button>
      </div>
    `;
  }
}

// Initialize gallery
loadGallery();
