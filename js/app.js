// ─────────────────────────────────────────────────────────────────────────────
// app.js  –  Firebase Auth + Firestore CV + Dark/Light + EN/DE language switch
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics, logEvent }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey:            "AIzaSyDO3KPedcutE9qL3ewEMXxdQx2MRBpC_aI",
    authDomain:        "personal-homepage-36392.firebaseapp.com",
    projectId:         "personal-homepage-36392",
    storageBucket:     "personal-homepage-36392.firebasestorage.app",
    messagingSenderId: "56950422780",
    appId:             "1:56950422780:web:f15150a0e2304416feeb79",
    measurementId:     "G-X1ZYSPM9C8"
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const provider = new GithubAuthProvider();
let   analytics;
try { analytics = getAnalytics(app); } catch (_) {}

function track(name, params = {}) {
    if (analytics) logEvent(analytics, name, params);
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const savedTheme = localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.documentElement.setAttribute("data-theme", savedTheme);

function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeBtn();
}

function updateThemeBtn() {
    const btn = document.getElementById("theme-btn");
    if (!btn) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.innerHTML = isDark
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Light`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark`;
}

// ── Language ──────────────────────────────────────────────────────────────────
let lang = localStorage.getItem("lang") || "en";

function toggleLang() {
    lang = lang === "en" ? "de" : "en";
    localStorage.setItem("lang", lang);
    const btn = document.getElementById("lang-btn");
    if (btn) btn.textContent = lang === "en" ? "DE" : "EN";
    if (window.__cvData) rebuildCV(auth.currentUser, window.__cvData);
}

// ── Auth state ────────────────────────────────────────────────────────────────
onAuthStateChanged(auth, async user => {
    if (user) {
        showLoading();
        try {
            await user.getIdToken(true);
            const cv = await fetchCV();
            window.__cvData = cv;
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
        `<div class="cv-loading"><div class="cv-spinner"></div><p>Loading&hellip;</p></div>`;
}

function showError(err) {
    console.error("CV load error:", err);
    document.getElementById("cv-root").innerHTML =
        `<div class="cv-error">
            <p>Could not load CV data. Please try refreshing.</p>
            <button onclick="location.reload()" class="btn-github" style="width:auto;margin-top:1rem">Reload</button>
         </div>`;
}

async function fetchCV() {
    const snap = await getDoc(doc(db, "cv", "main"));
    if (!snap.exists()) throw new Error("CV document not found.");
    return snap.data();
}

function mountCV(user, cv) {
    document.getElementById("cv-root").innerHTML = buildCV(user, cv);
    wireControls();
    track("login",     { method: "github" });
    track("page_view", { page_title: "CV", page_location: window.location.href });
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) track("section_view", { section: e.target.dataset.section });
        });
    }, { threshold: 0.35 });
    document.querySelectorAll("[data-section]").forEach(el => obs.observe(el));
}

function rebuildCV(user, cv) {
    const root = document.getElementById("cv-root");
    const scrollY = window.scrollY;
    root.innerHTML = buildCV(user, cv);
    wireControls();
    window.scrollTo(0, scrollY);
}

function wireControls() {
    document.getElementById("signout-btn") ?.addEventListener("click", () => signOut(auth));
    document.getElementById("theme-btn")  ?.addEventListener("click", toggleTheme);
    document.getElementById("lang-btn")   ?.addEventListener("click", toggleLang);
    updateThemeBtn();
}

// ── Sign-in button ────────────────────────────────────────────────────────────
document.getElementById("github-signin").addEventListener("click", async () => {
    const btn = document.getElementById("github-signin");
    btn.disabled = true; btn.textContent = "Connecting…";
    try {
        await signInWithPopup(auth, provider);
    } catch (err) {
        console.error("Auth error:", err.code, err.message);
        btn.disabled = false; btn.textContent = "Sign in with GitHub";
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function esc(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function t(obj) {
    // obj can be a plain string or { en: "...", de: "..." }
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj["en"] || "";
}

function renderTags(arr) {
    if (!arr || !arr.length) return "";
    return `<div class="tl-tags">${arr.map(tag =>
        `<span class="tag tag-${esc(tag.color)}">${esc(t(tag.label))}</span>`
    ).join("")}</div>`;
}

function renderTimelineItem(item) {
    return `
    <div class="tl-item">
        <div class="tl-dot tl-dot-${esc(item.color || "default")}"></div>
        <div class="tl-body">
            <div class="tl-header">
                <div>
                    <h3 class="tl-title">${esc(t(item.title))}</h3>
                    <p class="tl-org">${esc(t(item.org))}</p>
                </div>
                <span class="tl-date">${esc(t(item.date))}</span>
            </div>
            <p class="tl-desc">${esc(t(item.desc))}</p>
            ${renderTags(item.tags)}
        </div>
    </div>`;
}

function renderExtraCard(item) {
    return `
    <div class="extra-card">
        <div class="extra-marker extra-marker-${esc(item.color || "blue")}"></div>
        <div>
            <strong>${esc(t(item.title))}</strong>
            <p>${esc(t(item.desc))}</p>
            ${renderTags(item.tags)}
        </div>
    </div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// CV BUILDER
// ═════════════════════════════════════════════════════════════════════════════

function buildCV(user, cv) {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    const avatarHTML = user.photoURL
        ? `<img id="user-avatar" src="${esc(user.photoURL)}" alt="" class="topbar-avatar" style="display:block">`
        : "";

    // ── Sidebar: Languages ────────────────────────────────────────────────────
    const languagesHTML = (cv.languages || []).map(l => `
        <li>
            <span class="lang-name">${esc(t(l.name))}</span>
            <span class="lang-level">${esc(t(l.level))}</span>
        </li>`).join("");

    // ── Sidebar: Awards ───────────────────────────────────────────────────────
    const awardsHTML = (cv.awards || []).map(a => `
        <li class="award-item">
            <div class="award-bullet"></div>
            <div>
                <strong>${esc(t(a.title))}</strong>
                <span>${esc(t(a.org))}</span>
            </div>
        </li>`).join("");

    // ── Main: sections ────────────────────────────────────────────────────────
    const educationHTML    = (cv.education    || []).map(renderTimelineItem).join("");
    const workHTML         = (cv.work         || []).map(renderTimelineItem).join("");
    const emergencyHTML    = (cv.emergency    || []).map(renderTimelineItem).join("");
    const leadershipHTML   = (cv.leadership   || []).map(renderTimelineItem).join("");
    const projectsHTML     = (cv.projects     || []).map(renderExtraCard).join("");
    const volunteeringHTML = (cv.volunteering || []).map(renderTimelineItem).join("");

    // ── Labels (bilingual) ────────────────────────────────────────────────────
    const L = {
        languages:    lang === "de" ? "Sprachen"                : "Languages",
        awards:       lang === "de" ? "Auszeichnungen"          : "Awards & Certs",
        education:    lang === "de" ? "Ausbildung"              : "Education",
        work:         lang === "de" ? "Berufserfahrung"         : "Work Experience",
        emergency:    lang === "de" ? "Einsatzdienste"          : "Emergency Services",
        leadership:   lang === "de" ? "Führung & Hochschule"    : "Leadership & University",
        projects:     lang === "de" ? "Projekte"                : "Projects",
        volunteering: lang === "de" ? "Ehrenamt"                : "Volunteering",
        signout:      lang === "de" ? "Abmelden"                : "Sign out",
        impressum:    lang === "de" ? "Impressum & Datenschutz" : "Legal Notice",
        location:     esc(t(cv.location)),
    };

    return `
    <header class="topbar">
        <span class="topbar-name">${esc(t(cv.name))}</span>
        <div class="topbar-controls">
            <button id="lang-btn" class="icon-btn">${lang === "en" ? "DE" : "EN"}</button>
            <button id="theme-btn" class="icon-btn">&hellip;</button>
            <div class="topbar-user">
                ${avatarHTML}
                <span class="topbar-username">${esc(user.displayName || user.email || "")}</span>
                <button id="signout-btn" class="btn-signout">${L.signout}</button>
            </div>
        </div>
    </header>

    <main class="cv-wrap">

        <!-- Hero -->
        <section class="hero" data-section="hero">
            <div class="hero-photo-wrap">
                <img src="gero-professional.jpg" alt="${esc(t(cv.name))}" class="hero-photo">
            </div>
            <div class="hero-text">
                <h1 class="hero-name">${esc(t(cv.name))}</h1>
                <p class="hero-title">${esc(t(cv.title))}</p>
                <p class="hero-location">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${L.location}
                </p>
                <div class="hero-links">
                    <a href="${esc(cv.linkedin)}" target="_blank" rel="noopener" class="hero-link">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                    </a>
                    <a href="${esc(cv.instagram)}" target="_blank" rel="noopener" class="hero-link">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        Instagram
                    </a>
                    ${cv.orcid ? `<a href="${esc(cv.orcid)}" target="_blank" rel="noopener" class="hero-link">
                        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm-19.7 194.3H89.6V95.2h18.7v99.1zm-9.4-112.4c-6 0-10.8-4.9-10.8-10.8 0-6 4.9-10.8 10.8-10.8 6 0 10.8 4.9 10.8 10.8 0 6-4.8 10.8-10.8 10.8zm100.3 112.4h-18.7v-48.3c0-11.5-.2-26.3-16-26.3-16 0-18.5 12.5-18.5 25.4v49.2h-18.7V95.2h18v13.5h.3c2.5-4.7 8.6-9.7 17.7-9.7 18.9 0 22.4 12.5 22.4 28.7v66.6z"/></svg>
                        ORCID
                    </a>` : ""}
                    ${cv.email ? `<a href="mailto:${esc(cv.email)}" class="hero-link">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Email
                    </a>` : ""}
                </div>
                ${t(cv.summary) ? `<p class="hero-summary">${esc(t(cv.summary))}</p>` : ""}
            </div>
        </section>

        <!-- Two-column grid -->
        <div class="cv-grid">

            <!-- Sidebar -->
            <aside class="cv-sidebar">

                <section class="cv-block" data-section="languages">
                    <h2 class="block-title">${L.languages}</h2>
                    <ul class="lang-list">${languagesHTML}</ul>
                </section>

                <section class="cv-block" data-section="awards">
                    <h2 class="block-title">${L.awards}</h2>
                    <ul class="award-list">${awardsHTML}</ul>
                </section>

            </aside>

            <!-- Main -->
            <div class="cv-main">

                ${educationHTML    ? `<section class="cv-block" data-section="education"><h2 class="block-title">${L.education}</h2><div class="timeline">${educationHTML}</div></section>` : ""}
                ${workHTML         ? `<section class="cv-block" data-section="work"><h2 class="block-title">${L.work}</h2><div class="timeline">${workHTML}</div></section>` : ""}
                ${emergencyHTML    ? `<section class="cv-block" data-section="emergency"><h2 class="block-title">${L.emergency}</h2><div class="timeline">${emergencyHTML}</div></section>` : ""}
                ${leadershipHTML   ? `<section class="cv-block" data-section="leadership"><h2 class="block-title">${L.leadership}</h2><div class="timeline">${leadershipHTML}</div></section>` : ""}
                ${projectsHTML     ? `<section class="cv-block" data-section="projects"><h2 class="block-title">${L.projects}</h2><div class="extra-grid">${projectsHTML}</div></section>` : ""}
                ${volunteeringHTML ? `<section class="cv-block" data-section="volunteering"><h2 class="block-title">${L.volunteering}</h2><div class="timeline">${volunteeringHTML}</div></section>` : ""}

            </div>
        </div>

    </main>

    <footer class="cv-footer">
        <p>&copy; 2026 ${esc(t(cv.name))} &nbsp;&middot;&nbsp;
            <a href="impressum.html">${L.impressum}</a>
        </p>
    </footer>`;
}
