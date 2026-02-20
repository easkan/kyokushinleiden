# Karateschool Zen Website

Een moderne, responsive website voor een karate school, gebouwd met vanilla HTML, Tailwind CSS en Decap CMS.

## Projectstructuur

```text
/
├── admin/
│   ├── config.yml      # Decap CMS configuratie
│   └── index.html      # Decap CMS admin interface
├── data/
│   └── photos.json     # JSON bestand met foto data (beheerd door CMS)
├── src/
│   ├── css/
│   │   └── style.css   # Tailwind CSS styles
│   └── js/
│       └── gallery.js  # Script om foto's dynamisch te laden
├── uploads/            # Map voor geüploade foto's
├── index.html          # Home pagina
├── lessen.html         # Lesinformatie & rooster
├── tarieven.html       # Prijzen
├── gallery.html        # Foto galerij
├── contact.html        # Contactformulier
└── README.md           # Deze handleiding
```

## Deployment Instructies (Netlify)

Volg deze stappen om de site live te zetten met een werkend CMS:

### 1. GitHub Repository
1. Maak een nieuwe repository aan op GitHub.
2. Push alle bestanden van dit project naar de repository.

### 2. Netlify Deploy
1. Log in op [Netlify](https://app.netlify.com/).
2. Klik op **"Add new site"** > **"Import an existing project"**.
3. Kies GitHub en selecteer je repository.
4. **Build settings:**
   - Build command: `npm run build` (of laat leeg als je alleen statische bestanden hebt, maar in dit Vite project is het nodig).
   - Publish directory: `dist` (Vite output).
5. Klik op **"Deploy site"**.

### 3. Netlify Identity inschakelen
1. Ga in het Netlify dashboard naar **Site configuration** > **Identity**.
2. Klik op **"Enable Identity"**.
3. Scroll naar beneden naar **Registration preferences** en zet deze op **"Invite only"** (veiliger voor beheer).
4. Ga naar **Services** > **Git Gateway** en klik op **"Enable Git Gateway"**. Hiermee krijgt het CMS toegang tot je GitHub repo.

### 4. Gebruikers uitnodigen
1. Ga naar het tabblad **Identity** bovenaan in het Netlify dashboard.
2. Klik op **"Invite users"** en voer je eigen e-mailadres in.
3. Je ontvangt een e-mail. Klik op de link om je account te bevestigen en een wachtwoord in te stellen.

### 5. Foto's beheren via /admin
1. Ga naar `jouw-site-url.netlify.app/admin/`.
2. Log in met je Netlify Identity account.
3. Je ziet nu de collectie **"Foto Galerij"**.
4. Je kunt hier nieuwe foto's toevoegen, onderschriften aanpassen of foto's verwijderen.
5. Na het klikken op **"Publish"** zal Netlify een commit doen naar je GitHub repo.
6. De site wordt automatisch opnieuw gebouwd en de nieuwe foto's verschijnen in de galerij op de website.

## Contactformulier
Het formulier op `contact.html` maakt gebruik van **Netlify Forms**. Inzendingen verschijnen automatisch in het Netlify dashboard onder het tabblad **"Forms"**.


## Admin foto upload (Cloudinary)

Deze site gebruikt Cloudinary voor uploads en Netlify Functions om captions + volgorde op te slaan.

### 1) Cloudinary (unsigned preset)
Maak in Cloudinary een **Unsigned Upload Preset** aan met exact deze presetnaam (hoofdlettergevoelig).
Bijvoorbeeld: `Kyokushin`

### 2) Netlify Environment Variables
Voeg in Netlify deze environment variables toe en redeploy:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET` (bijv. `Kyokushin`)
- `UPLOAD_PASSWORD` (beheer wachtwoord)

### 3) URLs
- Upload (admin): `/upload.html`
- Galerij: `/gallery.html`

### 4) Lokale dev
```bash
npm install
npm run dev
```

> Netlify Functions test je lokaal het makkelijkst met:
```bash
npm i -g netlify-cli
netlify dev
```
