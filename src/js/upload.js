// Upload page logic (Cloudinary + Netlify Functions)
// Requires env vars: VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const els = {
  password: document.getElementById("admin-password"),
  uploadBtn: document.getElementById("upload-btn"),
  previewImg: document.getElementById("preview-img"),
  caption: document.getElementById("caption"),
  saveBtn: document.getElementById("save-btn"),
  status: document.getElementById("status"),
  previewWrap: document.getElementById("preview-wrap"),
};

function setStatus(msg) {
  if (els.status) els.status.textContent = msg || "";
}

let uploaded = null; // { publicId, imageUrl }

function ensureWidgetScript() {
  return new Promise((resolve, reject) => {
    if (window.cloudinary && window.cloudinary.createUploadWidget) return resolve();
    const existing = document.getElementById("cloudinary-widget");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Widget load error")));
      return;
    }
    const s = document.createElement("script");
    s.id = "cloudinary-widget";
    s.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Widget load error"));
    document.body.appendChild(s);
  });
}

async function openUploader() {
  setStatus("");

  if (!cloudName || !uploadPreset) {
    setStatus("Cloudinary env vars ontbreken (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET).");
    return;
  }

  try {
    await ensureWidgetScript();
  } catch (e) {
    setStatus("Cloudinary widget kon niet laden.");
    return;
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName,
      uploadPreset,
      sources: ["local", "camera"],
      multiple: false,
    },
    (error, result) => {
      if (error) {
        setStatus("Upload error: " + (error.message || String(error)));
        return;
      }
      if (result && result.event === "success") {
        uploaded = {
          publicId: result.info.public_id,
          imageUrl: result.info.secure_url,
        };

        if (els.previewImg) els.previewImg.src = uploaded.imageUrl;
        if (els.previewWrap) els.previewWrap.classList.remove("hidden");

        setStatus("Upload gelukt. Voeg (optioneel) een onderschrift toe en klik Opslaan.");
      }
    }
  );

  widget.open();
}

async function saveMeta() {
  setStatus("");
  if (!uploaded) {
    setStatus("Upload eerst een foto.");
    return;
  }

  const password = els.password ? els.password.value : "";
  if (!password) {
    setStatus("Vul het beheer wachtwoord in.");
    return;
  }

  const caption = els.caption ? els.caption.value : "";

  const res = await fetch("/.netlify/functions/gallery-add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-upload-password": password,
    },
    body: JSON.stringify({
      publicId: uploaded.publicId,
      imageUrl: uploaded.imageUrl,
      caption,
    }),
  });

  if (res.status === 401) {
    setStatus("Onjuist wachtwoord.");
    return;
  }
  if (!res.ok) {
    setStatus("Opslaan mislukt: " + (await res.text()));
    return;
  }

  setStatus("Opgeslagen ✅ (check de galerij)");
  if (els.caption) els.caption.value = "";
}

if (els.uploadBtn) els.uploadBtn.addEventListener("click", openUploader);
if (els.saveBtn) els.saveBtn.addEventListener("click", saveMeta);


// ===== DELETE + LIST LOGIC ADDED =====
async function loadItems() {
  const container = document.getElementById("items");
  if (!container) return;

  const res = await fetch("/.netlify/functions/gallery-list", { cache: "no-store" });
  const data = await res.json();
  const items = Array.isArray(data) ? data : [];

  container.innerHTML = items.map((it) => `
    <div style="margin:12px 0">
      <img src="${it.imageUrl}" style="width:100px;display:block" />
      <div>${it.caption || ""}</div>
      <button data-id="${it.id}" class="delete-btn">Verwijderen</button>
    </div>
  `).join("");

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const passwordInput = document.getElementById("admin-password");
      const password = passwordInput ? passwordInput.value : "";

      if (!password) {
        alert("Vul eerst het wachtwoord in.");
        return;
      }

      await fetch("/.netlify/functions/gallery-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": password,
        },
        body: JSON.stringify({ id }),
      });

      loadItems();
    });
  });
}

document.addEventListener("DOMContentLoaded", loadItems);
// ===== END DELETE LOGIC =====
