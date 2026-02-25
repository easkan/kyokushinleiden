// Upload page logic (Cloudinary + Netlify Functions)
// Requires env vars: VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const els = {
  password: document.getElementById("admin-password"),
  uploadBtn: document.getElementById("upload-btn"),
  previewImg: document.getElementById("preview-img"),
  caption: document.getElementById("caption"),
  categorySelect: document.getElementById("category-select"),
  categoryNew: document.getElementById("category-new"),
  categoryNewWrap: document.getElementById("category-new-wrap"),
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



function normalizeCategory(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 60);
}

async function loadCategories() {
  if (!els.categorySelect) return;
  try {
    const res = await fetch("/.netlify/functions/gallery-categories", { cache: "no-store" });
    if (!res.ok) return;
    const cats = await res.json();
    if (!Array.isArray(cats)) return;

    // Keep the first 2 default options (Ongecategoriseerd + Nieuwe categorie…)
    const keep = Array.from(els.categorySelect.querySelectorAll("option")).slice(0, 2);
    els.categorySelect.innerHTML = "";
    keep.forEach((opt) => els.categorySelect.appendChild(opt));

    cats
      .filter((c) => typeof c === "string" && c.trim())
      .forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        els.categorySelect.appendChild(opt);
      });
  } catch {
    // ignore
  }
}

function handleCategoryChange() {
  if (!els.categorySelect || !els.categoryNewWrap) return;
  const isNew = els.categorySelect.value === "__new__";
  els.categoryNewWrap.classList.toggle("hidden", !isNew);
  if (!isNew && els.categoryNew) els.categoryNew.value = "";
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

  let category = "";
  if (els.categorySelect) {
    if (els.categorySelect.value === "__new__") {
      category = normalizeCategory(els.categoryNew ? els.categoryNew.value : "");
    } else {
      category = normalizeCategory(els.categorySelect.value);
    }
  }


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
      category,
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
  // refresh categories (in case a new one was created)
  loadCategories();
  if (els.categorySelect) {
    const chosen = category || "";
    // Wait a tick so options are repopulated
    setTimeout(() => {
      if (els.categorySelect) els.categorySelect.value = chosen || "";
      handleCategoryChange();
    }, 0);
  }
  if (els.categoryNew) els.categoryNew.value = "";
  if (els.caption) els.caption.value = "";
}

if (els.uploadBtn) els.uploadBtn.addEventListener("click", openUploader);
if (els.saveBtn) els.saveBtn.addEventListener("click", saveMeta);


if (els.categorySelect) els.categorySelect.addEventListener("change", handleCategoryChange);
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  handleCategoryChange();
});
