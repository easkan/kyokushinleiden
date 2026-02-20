async function loadGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) {
    console.error('Gallery container element not found');
    return;
  }
  
  const loadingState = document.getElementById('loading-state');

  try {
    // Hardcoded photos since CMS is removed
    const photos = [
      {
        image: "https://picsum.photos/seed/karate3/800/800",
        caption: "Training in de dojo"
      },
      {
        image: "https://picsum.photos/seed/karate4/800/800",
        caption: "Focus en techniek"
      },
      {
        image: "https://picsum.photos/seed/karate5/800/800",
        caption: "Groepsles jeugd"
      }
    ];

    if (photos.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-20 text-center text-slate-400">
          Nog geen foto's beschikbaar.
        </div>
      `;
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Render photos
    photos.forEach(photo => {
      const photoCard = document.createElement('div');
      photoCard.className = 'group relative overflow-hidden border-4 border-kyokushin-black aspect-square shadow-xl hover:border-kyokushin-red transition-all duration-300';
      
      photoCard.innerHTML = `
        <img src="${photo.image}" alt="${photo.caption || 'Karate foto'}" 
             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
             loading="lazy"
             referrerPolicy="no-referrer">
        <div class="absolute inset-0 bg-gradient-to-t from-kyokushin-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
          <p class="text-white font-black uppercase italic tracking-widest text-lg">${photo.caption || ''}</p>
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
