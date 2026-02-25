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

  // Existing photos management
  existingList: document.getElementById("existing-list"),
  existingStatus: document.getElementById("existing-status"),
  existingRefresh: document.getElementById("existing-refresh"),
  existingFilterCategory: document.getElementById("existing-filter-category"),
  existingFilterSearch: document.getElementById("existing-filter-search"),
};

function setStatus(msg) {
  if (els.status) els.status.textContent = msg || "";
}

function setExistingStatus(msg) {
  if (els.existingStatus) els.existingStatus.textContent = msg || "";
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

let categoriesCache = [];

async function fetchCategories() {
  try {
    const res = await fetch("/.netlify/functions/gallery-categories", { cache: "no-store" });
    if (!res.ok) return [];
    const cats = await res.json();
    if (!Array.isArray(cats)) return [];
    return cats.filter((c) => typeof c === "string" && c.trim());
  } catch {
    return [];
  }
}

async function loadCategories() {
  if (!els.categorySelect) return;
  const cats = await fetchCategories();
  categoriesCache = cats;

  // Keep the first 2 default options (Ongecategoriseerd + Nieuwe categorie…)
  const keep = Array.from(els.categorySelect.querySelectorAll("option")).slice(0, 2);
  els.categorySelect.innerHTML = "";
  keep.forEach((opt) => els.categorySelect.appendChild(opt));

  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    els.categorySelect.appendChild(opt);
  });
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



let existingItems = [];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("nl-NL", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function getFilteredExisting() {
  const cat = els.existingFilterCategory ? els.existingFilterCategory.value : "__all__";
  const q = (els.existingFilterSearch ? els.existingFilterSearch.value : "").trim().toLowerCase();

  return existingItems.filter((it) => {
    if (!it) return false;
    if (cat && cat !== "__all__") {
      const itCat = (it.category || "");
      if (itCat !== cat) return false;
    }
    if (q) {
      const hay = `${it.caption || ""} ${it.id || ""} ${it.category || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function fillExistingFilterCategories() {
  if (!els.existingFilterCategory) return;

  const current = els.existingFilterCategory.value || "__all__";
  els.existingFilterCategory.innerHTML = "";
  const allOpt = document.createElement("option");
  allOpt.value = "__all__";
  allOpt.textContent = "Alle categorieën";
  els.existingFilterCategory.appendChild(allOpt);

  const cats = new Set();
  existingItems.forEach((it) => {
    if (it && typeof it.category === "string" && it.category.trim()) cats.add(it.category.trim());
  });
  // Also include known categories (from categories.json)
  categoriesCache.forEach((c) => cats.add(c));

  Array.from(cats)
    .sort((a, b) => a.localeCompare(b, "nl", { sensitivity: "base" }))
    .forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      els.existingFilterCategory.appendChild(opt);
    });

  els.existingFilterCategory.value = Array.from(els.existingFilterCategory.options).some(o => o.value === current) ? current : "__all__";
}

function buildCategorySelect(selected) {
  const sel = document.createElement("select");
  sel.className = "mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white";
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = "Ongecategoriseerd";
  sel.appendChild(opt0);

  // union of caches + existing categories
  const cats = new Set(categoriesCache);
  existingItems.forEach((it) => {
    if (it && it.category) cats.add(it.category);
  });

  Array.from(cats)
    .filter((c) => typeof c === "string" && c.trim())
    .sort((a, b) => a.localeCompare(b, "nl", { sensitivity: "base" }))
    .forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    });

  sel.value = typeof selected === "string" ? selected : "";
  return sel;
}

async function loadExisting() {
  if (!els.existingList) return;

  setExistingStatus("Laden…");
  try {
    const res = await fetch("/.netlify/functions/gallery-list", { cache: "no-store" });
    if (!res.ok) {
      setExistingStatus("Kon bestaande foto’s niet laden.");
      return;
    }
    const items = await res.json();
    existingItems = Array.isArray(items) ? items : [];
    setExistingStatus(`${existingItems.length} foto’s gevonden.`);
  } catch (e) {
    setExistingStatus("Kon bestaande foto’s niet laden.");
    return;
  }

  fillExistingFilterCategories();
  renderExisting();
}

function renderExisting() {
  if (!els.existingList) return;

  const list = getFilteredExisting();
  els.existingList.innerHTML = "";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "text-slate-600 text-sm";
    empty.textContent = "Geen foto’s gevonden met deze filter.";
    els.existingList.appendChild(empty);
    return;
  }

  list.forEach((it) => {
    const card = document.createElement("div");
    card.className = "bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm";

    const img = document.createElement("img");
    img.src = it.imageUrl;
    img.alt = it.caption || "Foto";
    img.className = "w-full h-48 object-cover bg-slate-100";
    card.appendChild(img);

    const body = document.createElement("div");
    body.className = "p-4";

    const meta = document.createElement("div");
    meta.className = "text-xs text-slate-500";
    meta.textContent = `ID: ${it.id} • ${it.createdAt ? formatDate(it.createdAt) : ""}`;
    body.appendChild(meta);

    const capLabel = document.createElement("label");
    capLabel.className = "block mt-3 text-xs font-bold uppercase tracking-widest text-slate-600";
    capLabel.textContent = "Onderschrift";
    const capInput = document.createElement("input");
    capInput.type = "text";
    capInput.value = it.caption || "";
    capInput.className = "mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm";
    capLabel.appendChild(capInput);
    body.appendChild(capLabel);

    const catLabel = document.createElement("label");
    catLabel.className = "block mt-3 text-xs font-bold uppercase tracking-widest text-slate-600";
    catLabel.textContent = "Categorie";
    const catSelect = buildCategorySelect(it.category || "");
    catLabel.appendChild(catSelect);
    body.appendChild(catLabel);

    const btnRow = document.createElement("div");
    btnRow.className = "mt-4 flex gap-2";

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "flex-1 rounded-xl bg-kyokushin-black text-white font-black uppercase tracking-widest text-xs py-3 hover:opacity-90 transition";
    saveBtn.textContent = "Opslaan";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "rounded-xl bg-slate-100 border border-slate-200 text-kyokushin-black font-black uppercase tracking-widest text-xs px-4 py-3 hover:bg-slate-200 transition";
    delBtn.textContent = "Verwijder";

    const inlineStatus = document.createElement("div");
    inlineStatus.className = "mt-3 text-xs text-slate-600";

    saveBtn.addEventListener("click", async () => {
      inlineStatus.textContent = "";
      const password = els.password ? els.password.value : "";
      if (!password) {
        inlineStatus.textContent = "Vul eerst het beheer wachtwoord in.";
        return;
      }

      const newCaption = capInput.value || "";
      const newCategory = catSelect.value || "";

      try {
        const res = await fetch("/.netlify/functions/gallery-update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-upload-password": password,
          },
          body: JSON.stringify({
            id: it.id,
            caption: newCaption,
            category: newCategory,
          }),
        });

        if (res.status === 401) {
          inlineStatus.textContent = "Onjuist wachtwoord.";
          return;
        }
        if (!res.ok) {
          inlineStatus.textContent = "Opslaan mislukt.";
          return;
        }

        const updated = await res.json();
        // update local cache
        existingItems = existingItems.map((x) => (x && x.id === it.id ? updated : x));
        // refresh categories + filters
        await loadCategories();
        fillExistingFilterCategories();
        inlineStatus.textContent = "Opgeslagen ✅";
      } catch {
        inlineStatus.textContent = "Opslaan mislukt.";
      }
    });

    delBtn.addEventListener("click", async () => {
      inlineStatus.textContent = "";
      const password = els.password ? els.password.value : "";
      if (!password) {
        inlineStatus.textContent = "Vul eerst het beheer wachtwoord in.";
        return;
      }
      if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) return;

      try {
        const res = await fetch("/.netlify/functions/gallery-delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-upload-password": password,
          },
          body: JSON.stringify({ id: it.id }),
        });

        if (res.status === 401) {
          inlineStatus.textContent = "Onjuist wachtwoord.";
          return;
        }
        if (!res.ok) {
          inlineStatus.textContent = "Verwijderen mislukt.";
          return;
        }

        existingItems = existingItems.filter((x) => x && x.id !== it.id);
        setExistingStatus(`${existingItems.length} foto’s gevonden.`);
        fillExistingFilterCategories();
        renderExisting();
      } catch {
        inlineStatus.textContent = "Verwijderen mislukt.";
      }
    });

    btnRow.appendChild(saveBtn);
    btnRow.appendChild(delBtn);
    body.appendChild(btnRow);
    body.appendChild(inlineStatus);

    card.appendChild(body);
    els.existingList.appendChild(card);
  });
}


if (els.uploadBtn) els.uploadBtn.addEventListener("click", openUploader);
if (els.saveBtn) els.saveBtn.addEventListener("click", saveMeta);


if (els.categorySelect) els.categorySelect.addEventListener("change", handleCategoryChange);
document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  handleCategoryChange();

  // Existing photos
  if (els.existingRefresh) els.existingRefresh.addEventListener("click", () => loadExisting());
  if (els.existingFilterCategory) els.existingFilterCategory.addEventListener("change", renderExisting);
  if (els.existingFilterSearch) els.existingFilterSearch.addEventListener("input", renderExisting);

  await loadExisting();
});
  handleCategoryChange();
});
