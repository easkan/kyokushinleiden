
let currentIndex = 0;
const images = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg"
];

function openLightbox(index) {
  currentIndex = index;
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightbox-img").src = images[currentIndex];
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function changeSlide(direction) {
  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  document.getElementById("lightbox-img").src = images[currentIndex];
}
