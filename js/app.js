// ─────────────────────────────────────────────────────────────────────────────
// app.js  –  Firebase Auth + Firestore CV fetch + Analytics
//
// SECURITY:
//   - index.html contains ZERO CV content
//   - This file contains ZERO CV content (no hardcoded data)
//   - CV data lives exclusively in Firestore, readable only by authenticated users
//   - Firebase API keys are safe to be public (they identify the project, not grant access)
//   - Real security = Firestore rules (auth required) + API key domain restrictions
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics, logEvent }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// ── REPLACE WITH YOUR FIREBASE PROJECT CONFIG ─────────────────────────────────
// Get from: Firebase Console → Project Settings → Your apps → Web app
// These values are safe to commit – they are NOT admin credentials.
const firebaseConfig = {
  apiKey: "AIzaSyDO3KPedcutE9qL3ewEMXxdQx2MRBpC_aI",
  authDomain: "personal-homepage-36392.firebaseapp.com",
  projectId: "personal-homepage-36392",
  storageBucket: "personal-homepage-36392.firebasestorage.app",
  messagingSenderId: "56950422780",
  appId: "1:56950422780:web:f15150a0e2304416feeb79",
  measurementId: "G-X1ZYSPM9C8"
};
// ─────────────────────────────────────────────────────────────────────────────

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const provider = new GithubAuthProvider();
let   analytics;

try { analytics = getAnalytics(app); } catch (_) { /* silently disabled on localhost */ }

function track(name, params = {}) {
    if (analytics) logEvent(analytics, name, params);
}

// ── Auth state ────────────────────────────────────────────────────────────────
onAuthStateChanged(auth, async user => {
    if (user) {
        showLoading();
        try {
            const cv = await fetchCV();
            mountCV(user, cv);
        } catch (err) {
            showError(err);
        }
    } else {
        unmountCV();
    }
});

function unmountCV() {
    document.getElementById("auth-gate").style.display = "flex";
    document.getElementById("cv-root").innerHTML = "";
}

function showLoading() {
    document.getElementById("auth-gate").style.display = "none";
    document.getElementById("cv-root").innerHTML =
        `<div class="cv-loading">
            <div class="cv-spinner"></div>
            <p>Loading CV&hellip;</p>
         </div>`;
}

function showError(err) {
    console.error("Failed to load CV:", err);
    const code = err.code || err.message || String(err);
    document.getElementById("cv-root").innerHTML =
        `<div class="cv-error">
            <p><strong>Could not load CV data.</strong></p>
            <p style="font-family:monospace;font-size:.8rem;margin-top:.5rem;color:#666">${code}</p>
            <button onclick="location.reload()" class="btn-github" style="width:auto;margin-top:1rem">Reload</button>
         </div>`;
}

// ── Fetch CV from Firestore ───────────────────────────────────────────────────
async function fetchCV() {
    // Force token refresh to ensure auth state is fresh
    const user = auth.currentUser;
    if (user) await user.getIdToken(true);

    const snap = await getDoc(doc(db, "cv", "main"));
    if (!snap.exists()) throw new Error("CV document not found in Firestore.");
    return snap.data();
}

// ── Mount CV into DOM ─────────────────────────────────────────────────────────
function mountCV(user, cv) {
    document.getElementById("cv-root").innerHTML = buildCV(user, cv);
    document.getElementById("signout-btn").addEventListener("click", () => signOut(auth));

    track("login",     { method: "github" });
    track("page_view", { page_title: "CV", page_location: window.location.href });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) track("section_view", { section: e.target.dataset.section });
        });
    }, { threshold: 0.35 });
    document.querySelectorAll("[data-section]").forEach(el => obs.observe(el));
}

// ── Sign-in button ────────────────────────────────────────────────────────────
document.getElementById("github-signin").addEventListener("click", async () => {
    const btn = document.getElementById("github-signin");
    btn.disabled    = true;
    btn.textContent = "Connecting…";
    try {
        await signInWithPopup(auth, provider);
    } catch (err) {
        console.error("Auth error:", err.code, err.message);
        btn.disabled    = false;
        btn.textContent = "Sign in with GitHub";
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// HTML BUILDER  –  constructs CV HTML from Firestore data
// ═════════════════════════════════════════════════════════════════════════════

function esc(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function renderTags(arr) {
    if (!arr || !arr.length) return "";
    return `<div class="tl-tags">${arr.map(t =>
        `<span class="tag tag-${esc(t.color)}">${esc(t.label)}</span>`
    ).join("")}</div>`;
}

function renderTimelineItem(item) {
    return `
    <div class="tl-item">
        <div class="tl-dot tl-dot-${esc(item.color)}"></div>
        <div class="tl-body">
            <div class="tl-header">
                <div>
                    <h3 class="tl-title">${esc(item.title)}</h3>
                    <p class="tl-org">${esc(item.org)}</p>
                </div>
                <span class="tl-date">${esc(item.date)}</span>
            </div>
            <p class="tl-desc">${esc(item.desc)}</p>
            ${renderTags(item.tags)}
        </div>
    </div>`;
}

function buildCV(user, cv) {
    const avatarHTML = user.photoURL
        ? `<img id="user-avatar" src="${esc(user.photoURL)}" alt="" class="topbar-avatar" style="display:block">`
        : `<span id="user-avatar"></span>`;

    const displayName = esc(user.displayName || user.email || "");

    // Skills
    const skillGroupsHTML = (cv.skillGroups || []).map(g => `
        <div class="skill-group">
            <h3 class="skill-group-title">${esc(g.title)}</h3>
            <div class="skill-tags">${(g.items || []).map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div>
        </div>`).join("");

    // Languages
    const languagesHTML = (cv.languages || []).map(l => `
        <li>
            <span class="lang-name">${esc(l.name)}</span>
            <span class="lang-level">${esc(l.level)}</span>
        </li>`).join("");

    // Awards
    const awardsHTML = (cv.awards || []).map(a => `
        <li class="award-item">
            <span class="award-icon">${esc(a.icon)}</span>
            <div>
                <strong>${esc(a.title)}</strong>
                <span>${esc(a.org)}</span>
            </div>
        </li>`).join("");

    // Interests
    const interestsHTML = (cv.interests || []).map(i => `<span class="tag">${esc(i)}</span>`).join("");

    // Timeline sections
    const educationHTML    = (cv.education    || []).map(renderTimelineItem).join("");
    const experienceHTML   = (cv.experience   || []).map(renderTimelineItem).join("");

    // Volunteering
    const volunteeringHTML = (cv.volunteering || []).map(v => `
        <div class="extra-card">
            <span class="extra-icon">${esc(v.icon)}</span>
            <div>
                <strong>${esc(v.title)}</strong>
                <p>${esc(v.desc)}</p>
            </div>
        </div>`).join("");

    return `
    <header class="topbar">
        <span class="topbar-name">${esc(cv.name)}</span>
        <div class="topbar-user">
            ${avatarHTML}
            <span class="topbar-username">${displayName}</span>
            <button id="signout-btn" class="btn-signout">Sign out</button>
        </div>
    </header>

    <main class="cv-wrap">

        <section class="hero" data-section="hero">
            <div class="hero-photo-wrap">
                <img src="gero-professional.jpg" alt="${esc(cv.name)}" class="hero-photo">
            </div>
            <div class="hero-text">
                <h1 class="hero-name">${esc(cv.name)}</h1>
                <p class="hero-title">${esc(cv.title)}</p>
                <p class="hero-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${esc(cv.location)}
                </p>
                <div class="hero-links">
                    <a href="${esc(cv.linkedin)}" target="_blank" rel="noopener" class="hero-link">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136
                            2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267
                            5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0
                            2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225
                            0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24
                            22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                    </a>
                    <a href="${esc(cv.instagram)}" target="_blank" rel="noopener" class="hero-link">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069
                            1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058
                            -1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265
                            -.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057
                            1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059
                            1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058
                            1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073
                            -1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059
                            -1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163
                            6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4
                            0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441
                            1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                    </a>
                </div>
                <p class="hero-summary">${esc(cv.summary)}</p>
            </div>
        </section>

        <div class="cv-grid">

            <aside class="cv-sidebar">
                <section class="cv-block" data-section="skills">
                    <h2 class="block-title">Skills</h2>
                    ${skillGroupsHTML}
                    <div class="skill-group">
                        <h3 class="skill-group-title">Languages</h3>
                        <ul class="lang-list">${languagesHTML}</ul>
                    </div>
                </section>
                <section class="cv-block" data-section="awards">
                    <h2 class="block-title">Awards &amp; Certs</h2>
                    <ul class="award-list">${awardsHTML}</ul>
                </section>
                <section class="cv-block" data-section="interests">
                    <h2 class="block-title">Interests</h2>
                    <div class="skill-tags">${interestsHTML}</div>
                </section>
            </aside>

            <div class="cv-main">
                <section class="cv-block" data-section="education">
                    <h2 class="block-title">Education</h2>
                    <div class="timeline">${educationHTML}</div>
                </section>
                <section class="cv-block" data-section="experience">
                    <h2 class="block-title">Experience</h2>
                    <div class="timeline">${experienceHTML}</div>
                </section>
                <section class="cv-block" data-section="volunteering">
                    <h2 class="block-title">Volunteering &amp; Extracurricular</h2>
                    <div class="extra-grid">${volunteeringHTML}</div>
                </section>
            </div>

        </div>
    </main>

    <footer class="cv-footer">
        <p>&copy; 2026 ${esc(cv.name)} &nbsp;&middot;&nbsp;
            <a href="${esc(cv.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        </p>
    </footer>`;
}
