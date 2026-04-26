/**
 * seed-firestore.js
 *
 * One-time script to upload your CV data to Firestore.
 * Run this locally – it uses the Firebase Admin SDK with a service account key,
 * so it has write access. The key file NEVER goes into your public repo.
 *
 * Prerequisites:
 *   npm install firebase-admin
 *
 * Usage:
 *   node seed-firestore.js
 */

const admin = require("firebase-admin");

// ── REPLACE: path to your downloaded service account key JSON ────────────────
// Download from: Firebase Console → Project Settings → Service accounts → Generate new private key
const serviceAccount = require("./serviceAccountKey.json");  // ← NEVER commit this file
// ─────────────────────────────────────────────────────────────────────────────

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ═════════════════════════════════════════════════════════════════════════════
// CV DATA  –  edit your details here, then run the script
// ═════════════════════════════════════════════════════════════════════════════
const cvData = {
    name:     "Gero von Manstein",
    title:    "Information Engineering Student & Working Student @ Daimler Truck",
    location: "Heilbronn & Munich, Germany",
    linkedin: "https://www.linkedin.com/in/gerovm/",
    instagram:"https://www.instagram.com/gerov.m/",
    summary:  "Dual-track professional combining Information Engineering at TU Munich with hands-on emergency services. Working student at Daimler Truck building AI-powered enterprise tools. Konrad-Adenauer Scholar. Head of TUM Campus Heilbronn's first elected Student Council.",

    skillGroups: [
        {
            title: "Programming & Tech",
            items: ["Python", "APIs / REST", "AI / ML", "System Integration", "SQL", "Git", "Linux"],
        },
        {
            title: "Emergency Services",
            items: ["First Responder", "Paramedic", "Drone Operations", "Incident Command"],
        },
        {
            title: "Leadership",
            items: ["Student Governance", "Event Management", "Public Speaking", "Team Leadership"],
        },
    ],

    languages: [
        { name: "German",  level: "Native" },
        { name: "English", level: "C1 – Cambridge" },
        { name: "French",  level: "Basic" },
    ],

    awards: [
        { icon: "🏅", title: "Konrad-Adenauer Scholarship",  org: "Konrad-Adenauer-Stiftung · Apr 2025" },
        { icon: "🎓", title: "C1 Advanced English",          org: "Cambridge Assessment · 2022" },
        { icon: "🚒", title: "Firefighter Basic Training",   org: "Feuerwehr Baden-Württemberg · 2024" },
        { icon: "🚁", title: "Drone Pilot License A1/A3",    org: "LBA · 2023" },
    ],

    interests: [
        "Artificial Intelligence", "Drones & UAV", "Emergency Medicine",
        "Politics", "Entrepreneurship", "Hiking",
    ],

    education: [
        {
            color: "blue",
            title: "B.Sc. Information Engineering",
            org:   "Technical University of Munich · Campus Heilbronn",
            date:  "Oct 2023 – Present",
            desc:  "Interdisciplinary programme combining computer science, electrical engineering, and management. Focus on AI, data systems, and enterprise software. Konrad-Adenauer Scholar since April 2025.",
            tags:  [
                { label: "TUM",        color: "blue" },
                { label: "Heilbronn",  color: "blue" },
                { label: "Scholarship",color: "blue" },
            ],
        },
        {
            color: "default",
            title: "Abitur",
            org:   "Gymnasium Starnberg",
            date:  "2023",
            desc:  "Focus subjects: Mathematics, Physics, Computer Science.",
            tags:  [],
        },
    ],

    experience: [
        {
            color: "blue",
            title: "Working Student – System Integration & AI",
            org:   "Daimler Truck AG · Leinfelden-Echterdingen",
            date:  "2024 – Present",
            desc:  "Building AI-powered enterprise tools and integrating internal systems. Connecting LinkedIn Learning, Oracle, and Udemy APIs into a unified learning platform. Developing and deploying an internal AI chatbot for knowledge management.",
            tags:  [
                { label: "Python",             color: "blue" },
                { label: "APIs",               color: "blue" },
                { label: "AI / ML",            color: "blue" },
                { label: "System Integration", color: "blue" },
            ],
        },
        {
            color: "purple",
            title: "Head of Student Council",
            org:   "TUM Campus Heilbronn · Studentische Vertretung",
            date:  "Dec 2024 – Present",
            desc:  "First democratically elected head of TUM Campus Heilbronn's student council, representing 1,000+ students across 6 departments. Established formal co-determination rights in university committees. Organises semester events, freshman orientations, and campus activities.",
            tags:  [
                { label: "Leadership",     color: "purple" },
                { label: "Governance",     color: "purple" },
                { label: "1,000+ Students",color: "purple" },
            ],
        },
        {
            color: "red",
            title: "Firefighter",
            org:   "Freiwillige Feuerwehr Heilbronn",
            date:  "Nov 2024 – Present",
            desc:  "Active volunteer firefighter responding to fire, rescue, and hazmat incidents in the city of Heilbronn.",
            tags:  [
                { label: "Firefighting", color: "red" },
                { label: "Rescue",       color: "red" },
            ],
        },
        {
            color: "red",
            title: "Drone Squadron Head · IT Administrator · Paramedic",
            org:   "FF Ebenhausen-Schäftlarn",
            date:  "2022 – Present",
            desc:  "Leading the drone unit for aerial reconnaissance and search & rescue operations. Managing all IT infrastructure for the brigade. Providing first-responder paramedic care at incidents.",
            tags:  [
                { label: "Drone Ops", color: "red" },
                { label: "IT Admin",  color: "red" },
                { label: "Paramedic", color: "red" },
            ],
        },
        {
            color: "red",
            title: "Paramedic & First Responder",
            org:   "Sanitätsteam BW",
            date:  "2022 – Present",
            desc:  "Providing medical support at public events and emergency standby operations across Baden-Württemberg.",
            tags:  [
                { label: "First Aid",     color: "red" },
                { label: "Event Medical", color: "red" },
            ],
        },
    ],

    volunteering: [
        {
            icon:  "🏛️",
            title: "Konrad-Adenauer-Stiftung",
            desc:  "Scholar & network member since April 2025. Participating in political education seminars and leadership programmes across Germany.",
        },
        {
            icon:  "🎓",
            title: "TUM Peer Mentor",
            desc:  "Supporting incoming students with academic orientation and campus life at TUM Heilbronn.",
        },
        {
            icon:  "🎉",
            title: "Campus Event Organiser",
            desc:  "Organising semester parties, freshman welcome events, and game nights for the TUM Heilbronn student community.",
        },
    ],
};

// ── Upload to Firestore ───────────────────────────────────────────────────────
async function seed() {
    console.log("Uploading CV data to Firestore...");
    await db.collection("cv").doc("main").set(cvData);
    console.log("✓ CV data uploaded to Firestore at collection: cv / document: main");
    process.exit(0);
}

seed().catch(err => {
    console.error("✗ Upload failed:", err);
    process.exit(1);
});
