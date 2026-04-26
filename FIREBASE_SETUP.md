# Firebase Setup Guide
## GitHub Authentication + Firestore CV Storage + Google Analytics 4

---

## Analytics Recommendation: Google Analytics 4 via Firebase

**Use Google Analytics 4 (GA4) built into Firebase** – it is:
- ✅ Completely **free** (no self-hosting, no credit card)
- ✅ Tracks user demographics, device, browser, country, session duration, page views, custom events
- ✅ One SDK handles authentication, database, and analytics
- ✅ View data at [analytics.google.com](https://analytics.google.com) and the [Firebase Console](https://console.firebase.google.com)

### Data collected per visitor

| Data point | Where to find it |
|---|---|
| GitHub username / display name | Firebase Console → Authentication → Users |
| Country & city | GA4 → Reports → Demographics |
| Device type | GA4 → Reports → Tech |
| Browser & OS | GA4 → Reports → Tech |
| Session duration | GA4 → Reports → Engagement |
| Which CV sections they viewed | GA4 → Events → `section_view` |
| Sign-in events | GA4 → Events → `login` |
| Page views | GA4 → Events → `page_view` |

---

## Security Model

### What is public vs. private

| Item | Visibility | Notes |
|---|---|---|
| `index.html` | Public | Auth gate shell only – **zero CV content** |
| `styles/main.css` | Public | Just styling |
| `js/app.js` | Public | Firebase config + renderer – **zero CV content** |
| `firestore/seed-firestore.js` | Public | Seed script – **zero CV content at runtime** |
| `firestore/serviceAccountKey.json` | **NEVER public** | In `.gitignore` – admin credentials |
| CV data | **Private** | Lives only in Firestore, requires auth to read |
| Firebase `apiKey` | Public (by design) | Identifies project only, not an admin credential |

### How the CV content is protected

1. `index.html` is an empty shell – no CV data in source
2. `js/app.js` contains no CV data – it only fetches from Firestore after auth
3. Firestore security rules require a valid Firebase session to read the `cv` collection
4. Without authentication, `cv-root` is an empty `<div>` – nothing to scrape

---

## Step 1 – Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it e.g. `gerovm-cv`
4. **Enable Google Analytics** when prompted → select or create a GA4 property
5. Click **"Create project"**

---

## Step 2 – Register your Web App

1. In the Firebase console, click the **`</>`** (Web) icon on the project overview
2. App nickname: `CV Website`
3. Skip Firebase Hosting (you use GitHub Pages)
4. Click **"Register app"**
5. Copy the `firebaseConfig` object:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "gerovm-cv.firebaseapp.com",
  projectId:         "gerovm-cv",
  storageBucket:     "gerovm-cv.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123",
  measurementId:     "G-XXXXXXXXXX"
};
```

6. Open `js/app.js` and **replace the placeholder `firebaseConfig`** block (lines 28–37) with your real values.

---

## Step 3 – Enable GitHub Authentication

### 3a – Create a GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Gero CV`
   - **Homepage URL**: `https://gerovonmanstein.github.io`
   - **Authorization callback URL**:
     ```
     https://YOUR-PROJECT-ID.firebaseapp.com/__/auth/handler
     ```
4. Click **"Register application"**
5. Note the **Client ID**
6. Click **"Generate a new client secret"** → copy it immediately

### 3b – Add GitHub provider in Firebase

1. Firebase Console → **Authentication** → **Sign-in method**
2. Click **GitHub** → toggle **Enable**
3. Paste your **Client ID** and **Client Secret**
4. Click **Save**

### 3c – Add your domain to Authorized Domains

1. **Authentication** → **Settings** → **Authorized domains**
2. Verify `gerovonmanstein.github.io` is listed; add it if not
3. Optionally remove `localhost` if you don't need local testing

---

## Step 4 – Set Up Firestore (CV data storage)

### 4a – Create the Firestore database

1. Firebase Console → **Firestore Database** → **Create database**
2. Select **"Start in production mode"** (rules deny all by default)
3. Choose a region close to you (e.g. `europe-west3` for Frankfurt)
4. Click **"Enable"**

### 4b – Set Firestore Security Rules

1. Firestore Console → **Rules** tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // CV data: readable only by authenticated users, never writable from client
    match /cv/{document} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Block everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

### 4c – Download a Service Account Key (for the seed script only)

> ⚠️ This key has admin access to your Firebase project. Treat it like a password.
> It is already in `.gitignore` and must **never** be committed to your repo.

1. Firebase Console → **Project Settings** (gear icon) → **Service accounts** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** in the confirmation dialog
4. Save the downloaded JSON file as:
   ```
   firestore/serviceAccountKey.json
   ```
   (This path is already in `.gitignore`)

### 4d – Upload CV data to Firestore (one-time seed)

1. Open a terminal in the project root
2. Install the Firebase Admin SDK:
   ```bash
   cd firestore
   npm init -y
   npm install firebase-admin
   ```
3. Edit `firestore/seed-firestore.js` to update your CV data if needed
4. Run the seed script:
   ```bash
   node seed-firestore.js
   ```
5. You should see:
   ```
   Uploading CV data to Firestore...
   ✓ CV data uploaded to Firestore at collection: cv / document: main
   ```
6. Verify in Firebase Console → **Firestore Database** → you should see a `cv` collection with a `main` document containing all your CV data

### 4e – Delete the service account key after seeding

Once the data is uploaded, you don't need the key anymore for day-to-day use:

```bash
# Delete the key file (it's already in .gitignore but better to remove it)
del firestore\serviceAccountKey.json   # Windows
rm firestore/serviceAccountKey.json    # Mac/Linux
```

You can always generate a new one if you need to update the CV data later.

### 4f – Updating CV data later

Whenever you want to update your CV:
1. Edit the `cvData` object in `firestore/seed-firestore.js`
2. Generate a new service account key (Step 4c)
3. Run `node seed-firestore.js` again (it overwrites the existing document)
4. Delete the key file

---

## Step 5 – Security Hardening

### 5a – Restrict your Firebase API key

1. Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Find **"Browser key (auto created by Firebase)"**
3. Click it → **Application restrictions** → select **"HTTP referrers"**
4. Add:
   ```
   https://gerovonmanstein.github.io/*
   gerovonmanstein.github.io/*
   ```
5. **API restrictions** → **"Restrict key"** → enable only:
   - Identity Toolkit API
   - Firebase Installations API
   - Cloud Firestore API
   - Google Analytics API
6. Click **Save**

### 5b – Enable Firebase App Check (recommended)

1. Firebase Console → **App Check** → click your web app → **Get started**
2. Select **reCAPTCHA v3** as the provider
3. Register at [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) → create a v3 site key for `gerovonmanstein.github.io`
4. Paste the site key → **Save** → then **Enforce**

---

## Step 6 – Deploy to GitHub Pages

```bash
git add .
git commit -m "Redesign: clean CV with Firebase auth + Firestore + analytics"
git push
```

> Make sure `firestore/serviceAccountKey.json` is NOT in the commit.
> Run `git status` first to verify it's not listed.

---

## Step 7 – Verify everything works

1. Visit `https://gerovonmanstein.github.io`
2. Auth gate appears with your photo and sign-in button
3. Click **"Sign in with GitHub"** → popup → authorize → loading spinner → CV appears
4. Firebase Console → **Authentication** → **Users** → your GitHub account listed
5. Firestore Console → **Data** → `cv/main` document exists
6. GA4 → **Realtime** → you appear as an active user

---

## Viewing Analytics Data

| Report | What you see |
|---|---|
| GA4 Realtime | Live visitors right now |
| GA4 Acquisition | How users found the site |
| GA4 Engagement → Events | `login`, `page_view`, `section_view` |
| GA4 User → Demographics | Country, city, language |
| GA4 Tech | Device, browser, OS |
| Firebase Auth → Users | GitHub usernames of everyone who signed in |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Popup blocked | Sign-in is triggered by a real click event (it is) |
| `auth/unauthorized-domain` | Add `gerovonmanstein.github.io` to Firebase Auth → Authorized Domains |
| `auth/operation-not-allowed` | Enable GitHub provider in Firebase Auth → Sign-in method |
| `auth/invalid-api-key` | Check `firebaseConfig` values in `js/app.js` |
| "CV document not found" | Run the seed script (Step 4d) |
| Firestore permission denied | Check security rules (Step 4b) and that user is authenticated |
| Analytics not showing | GA4 takes 24–48 h to populate; check Realtime first |
| API key rejected | Check HTTP referrer restrictions in Google Cloud Console |

---

## Final File Structure

```
gerovonmanstein.github.io/
├── index.html                    ← Auth gate shell (NO CV content)
├── gero-professional.jpg
├── styles/
│   └── main.css                  ← All styles
├── js/
│   └── app.js                    ← Firebase auth + Firestore fetch + renderer
├── firestore/
│   ├── seed-firestore.js         ← One-time CV data upload script
│   └── serviceAccountKey.json   ← ⚠️ IN .gitignore – NEVER commit
├── FIREBASE_SETUP.md             ← This file
├── .gitignore
└── CNAME
```

### What a visitor sees in "View Source"

- `index.html`: auth gate HTML only – no CV data
- `js/app.js`: Firebase config (safe) + HTML renderer – no CV data
- CV data: exists **only** in Firestore, readable only after GitHub authentication
