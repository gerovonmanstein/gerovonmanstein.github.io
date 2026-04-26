/**
 * seed-firestore.js  –  Upload CV data to Firestore
 *
 * Usage:
 *   1. Download service account key from Firebase Console → Project Settings → Service accounts
 *   2. Save as firestore/serviceAccountKey.json  (already in .gitignore)
 *   3. cd firestore && node seed-firestore.js
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ── Bilingual helper: { en, de } ──────────────────────────────────────────────
// All text fields support { en: "...", de: "..." } or a plain string.

const cvData = {

    name:      "Gero von Manstein",
    linkedin:  "https://www.linkedin.com/in/gerovm/",
    instagram: "https://www.instagram.com/gerov.m/",
    orcid:     "https://orcid.org/0009-0006-3234-4651",
    email:     "skiff.onion5u@icloud.com",

    title: {
        en: "Information Engineering Student & Working Student at Daimler Truck",
        de: "Student Informationstechnik & Werkstudent bei Daimler Truck",
    },
    location: {
        en: "Heilbronn & Munich, Germany",
        de: "Heilbronn & München, Deutschland",
    },
    summary: { en: "", de: "" },

    languages: [
        { name: { en: "German",  de: "Deutsch"  }, level: { en: "Native",        de: "Muttersprache" } },
        { name: { en: "English", de: "Englisch" }, level: { en: "Bilingual", de: "Bilingual" } },
    ],

    awards: [
        {
            title: { en: "Konrad-Adenauer Scholarship",  de: "Stipendium der Konrad-Adenauer-Stiftung" },
            org:   { en: "Konrad-Adenauer-Stiftung · Apr 2025", de: "Konrad-Adenauer-Stiftung · Apr. 2025" },
        },
        {
            title: { en: "C1 Advanced English",          de: "C1 Advanced Englisch" },
            org:   "Cambridge Assessment · 2022",
        },
    ],

    // ── Education ─────────────────────────────────────────────────────────────
    education: [
        {
            color: "blue",
            title: "B.Sc. Information Engineering",
            org:   { en: "Technical University of Munich · Campus Heilbronn", de: "Technische Universität München · Campus Heilbronn" },
            date:  { en: "Oct 2023 – Present",                  de: "Okt. 2023 – heute" },
            desc:  {
                en: "Interdisciplinary programme combining computer science, electrical engineering, and management. Focus on AI, data systems, and enterprise software. Konrad-Adenauer Scholar since April 2025.",
                de: "Interdisziplinäres Studium aus Informatik, Elektrotechnik und Betriebswirtschaft. Schwerpunkte: KI, Datensysteme und Unternehmenssoftware. Stipendiat der Konrad-Adenauer-Stiftung seit April 2025.",
            },
            tags: [],
        },
        {
            color: "default",
            title: "Abitur",
            org:   "Rainer-Maria-Rilke-Gymnasium Icking",
            date:  "2023",
            desc:  { en: "", de: "" },
            tags: [],
        },
    ],

    // ── Work Experience ───────────────────────────────────────────────────────
    work: [
        {
            color: "blue",
            title: {
                en: "Working Student – System Integration & AI",
                de: "Werkstudent – Systemintegration & KI",
            },
            org:  "Daimler Truck AG · Leinfelden-Echterdingen",
            date: { en: "2024 – Present", de: "2024 – heute" },
            desc: {
                en: "Building AI-powered enterprise tools and integrating internal systems. Connecting LinkedIn Learning, Oracle, and Udemy APIs into a unified learning platform. Developing and deploying an internal AI chatbot for knowledge management.",
                de: "Entwicklung KI-gestützter Unternehmenstools und Integration interner Systeme. Anbindung von LinkedIn Learning, Oracle und Udemy APIs in eine einheitliche Lernplattform. Entwicklung und Deployment eines internen KI-Chatbots für Wissensmanagement.",
            },
            tags: [],
        },
    ],

    emergency: [],
    leadership: [],

    projects: [],

    // ── Volunteering (Emergency Services + Student Council) ───────────────────
    volunteering: [
        {
            color: "purple",
            title: {
                en: "Head of Student Council",
                de: "Vorsitzender der Studierendenvertretung",
            },
            org:  { en: "TUM Campus Heilbronn · Student Council", de: "TUM Campus Heilbronn · Studierendenvertretung" },
            date: { en: "Dec 2024 – Present",                     de: "Dez. 2024 – heute" },
            desc: {
                en: "First democratically elected head of TUM Campus Heilbronn's student council, representing 1,000+ students across 6 departments. Organises semester events, freshman orientations, and campus activities.",
                de: "Erster demokratisch gewählter Vorsitzender der Studierendenvertretung am TUM Campus Heilbronn. Vertretung von über 1.000 Studierenden in 6 Fachbereichen. Organisation von Semesterfeiern, Erstsemesterveranstaltungen und Campus-Events.",
            },
            tags: [],
        },
        {
            color: "red",
            title: { en: "Firefighter",          de: "Feuerwehrmann" },
            org:   "Freiwillige Feuerwehr Heilbronn/Ebenhausen-Schäftlarn/Hohenschäftlarn",
            date:  { en: "Nov 2024 – Present",   de: "Nov. 2024 – heute" },
            desc:  {
                en: "Active volunteer firefighter responding to fire, rescue, and hazmat incidents in the city of Heilbronn.",
                de: "Aktiver Feuerwehrmann im Lösch- und Hilfeleistungseinsatz sowie bei Gefahrguteinsätzen in Heilbronn.",
            },
            tags: [],
        },
        {
            color: "red",
            title: { en: "Paramedic (Rettungssanitäter) & First Responder", de: "Rettungssanitäter & Ersthelfer" },
            org:   "Sanitätsteam BW · ASB (FAMS)",
            date:  { en: "2022 – Present", de: "2022 – heute" },
            desc:  {
                en: "Qualified Rettungssanitäter (paramedic) after completing training at ASB / FAMS (2025–2026). Providing medical support at public events and emergency standby operations across Baden-Württemberg.",
                de: "Abgeschlossene Ausbildung zum Rettungssanitäter beim ASB an der FAMS (2025–2026). Sanitätsdienst bei Veranstaltungen und Bereitschaftseinsätzen in ganz Baden-Württemberg.",
            },
            tags: [],
        },
    ],
};

// ── Upload ────────────────────────────────────────────────────────────────────
async function seed() {
    console.log("Uploading CV data to Firestore...");
    await db.collection("cv").doc("main").set(cvData);
    console.log("Done: cv/main");
    process.exit(0);
}

seed().catch(err => { console.error("Error:", err); process.exit(1); });
