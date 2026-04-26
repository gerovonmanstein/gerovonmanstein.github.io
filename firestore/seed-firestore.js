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

    title: {
        en: "Information Engineering Student & Working Student at Daimler Truck",
        de: "Student Informationstechnik & Werkstudent bei Daimler Truck",
    },
    location: {
        en: "Heilbronn & Munich, Germany",
        de: "Heilbronn & München, Deutschland",
    },
    summary: {
        en: "Combining Information Engineering at TU Munich with hands-on emergency services and student leadership. Working student at Daimler Truck building AI-powered enterprise tools. Konrad-Adenauer Scholar. First elected Head of TUM Campus Heilbronn Student Council.",
        de: "Studium der Informationstechnik an der TU München verbunden mit aktivem Einsatzdienst und studentischer Selbstverwaltung. Werkstudent bei Daimler Truck im Bereich KI-gestützte Unternehmenssoftware. Stipendiat der Konrad-Adenauer-Stiftung. Erster gewählter Vorsitzender der Studierendenvertretung am TUM Campus Heilbronn.",
    },

    // ── Skills ────────────────────────────────────────────────────────────────
    skillGroups: [
        {
            title: { en: "Programming & Tech", de: "Programmierung & Technik" },
            items: ["Python", "REST APIs", "AI / ML", "System Integration", "SQL", "Git", "Linux"],
        },
        {
            title: { en: "Emergency Services", de: "Einsatzdienste" },
            items: [
                { en: "First Responder",    de: "Ersthelfer" },
                { en: "Paramedic",          de: "Sanitäter" },
                { en: "Drone Operations",   de: "Drohnenoperator" },
                { en: "Incident Command",   de: "Einsatzleitung" },
            ],
        },
        {
            title: { en: "Leadership", de: "Führung" },
            items: [
                { en: "Student Governance", de: "Hochschulpolitik" },
                { en: "Event Management",   de: "Veranstaltungsmanagement" },
                { en: "Public Speaking",    de: "Öffentliches Reden" },
                { en: "Team Leadership",    de: "Teamführung" },
            ],
        },
    ],

    languages: [
        { name: { en: "German",  de: "Deutsch"  }, level: { en: "Native",        de: "Muttersprache" } },
        { name: { en: "English", de: "Englisch" }, level: { en: "C1 – Cambridge", de: "C1 – Cambridge" } },
        { name: { en: "French",  de: "Französisch" }, level: { en: "Basic",       de: "Grundkenntnisse" } },
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
        {
            title: { en: "Firefighter Basic Training",   de: "Grundausbildung Feuerwehr" },
            org:   { en: "Feuerwehr Baden-Württemberg · 2024", de: "Feuerwehr Baden-Württemberg · 2024" },
        },
        {
            title: { en: "Drone Pilot License A1/A3",    de: "Drohnenführerschein A1/A3" },
            org:   "LBA · 2023",
        },
    ],

    interests: [
        { en: "Artificial Intelligence", de: "Künstliche Intelligenz" },
        { en: "Drones & UAV",            de: "Drohnen & UAV" },
        { en: "Emergency Medicine",      de: "Notfallmedizin" },
        { en: "Politics",                de: "Politik" },
        { en: "Entrepreneurship",        de: "Unternehmertum" },
        { en: "Hiking",                  de: "Wandern" },
    ],

    // ── Education ─────────────────────────────────────────────────────────────
    education: [
        {
            color: "blue",
            title: { en: "B.Sc. Information Engineering",       de: "B.Sc. Informationstechnik" },
            org:   { en: "Technical University of Munich · Campus Heilbronn", de: "Technische Universität München · Campus Heilbronn" },
            date:  { en: "Oct 2023 – Present",                  de: "Okt. 2023 – heute" },
            desc:  {
                en: "Interdisciplinary programme combining computer science, electrical engineering, and management. Focus on AI, data systems, and enterprise software. Konrad-Adenauer Scholar since April 2025.",
                de: "Interdisziplinäres Studium aus Informatik, Elektrotechnik und Betriebswirtschaft. Schwerpunkte: KI, Datensysteme und Unternehmenssoftware. Stipendiat der Konrad-Adenauer-Stiftung seit April 2025.",
            },
            tags: [
                { label: "TUM",        color: "blue" },
                { label: "Heilbronn",  color: "blue" },
                { label: { en: "Scholarship", de: "Stipendium" }, color: "blue" },
            ],
        },
        {
            color: "default",
            title: "Abitur",
            org:   "Gymnasium Starnberg",
            date:  "2023",
            desc:  {
                en: "Focus subjects: Mathematics, Physics, Computer Science.",
                de: "Leistungskurse: Mathematik, Physik, Informatik.",
            },
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
            tags: [
                { label: "Python",                                          color: "blue" },
                { label: "REST APIs",                                       color: "blue" },
                { label: "AI / ML",                                         color: "blue" },
                { label: { en: "System Integration", de: "Systemintegration" }, color: "blue" },
            ],
        },
    ],

    // ── Emergency Services ────────────────────────────────────────────────────
    emergency: [
        {
            color: "red",
            title: { en: "Firefighter",                         de: "Feuerwehrmann" },
            org:   "Freiwillige Feuerwehr Heilbronn",
            date:  { en: "Nov 2024 – Present",                  de: "Nov. 2024 – heute" },
            desc:  {
                en: "Active volunteer firefighter responding to fire, rescue, and hazmat incidents in the city of Heilbronn.",
                de: "Aktiver Feuerwehrmann im Lösch- und Hilfeleistungseinsatz sowie bei Gefahrguteinsätzen in Heilbronn.",
            },
            tags: [
                { label: { en: "Firefighting", de: "Brandbekämpfung" }, color: "red" },
                { label: { en: "Rescue",       de: "Technische Hilfe" }, color: "red" },
            ],
        },
        {
            color: "red",
            title: {
                en: "Drone Squadron Head · IT Administrator · Paramedic",
                de: "Drohnenstaffelleiter · IT-Administrator · Sanitäter",
            },
            org:  "FF Ebenhausen-Schäftlarn",
            date: { en: "2022 – Present", de: "2022 – heute" },
            desc: {
                en: "Leading the drone unit for aerial reconnaissance and search & rescue operations. Managing all IT infrastructure for the brigade. Providing first-responder paramedic care at incidents.",
                de: "Leitung der Drohnenstaffel für Luftaufklärung und Sucheinsätze. Verwaltung der gesamten IT-Infrastruktur der Wehr. Sanitätsdienst als Ersthelfer bei Einsätzen.",
            },
            tags: [
                { label: { en: "Drone Ops",  de: "Drohnenbetrieb" }, color: "red" },
                { label: { en: "IT Admin",   de: "IT-Administration" }, color: "red" },
                { label: { en: "Paramedic",  de: "Sanitäter" }, color: "red" },
            ],
        },
        {
            color: "red",
            title: { en: "Paramedic & First Responder",         de: "Sanitäter & Ersthelfer" },
            org:   "Sanitätsteam BW",
            date:  { en: "2022 – Present",                      de: "2022 – heute" },
            desc:  {
                en: "Providing medical support at public events and emergency standby operations across Baden-Württemberg.",
                de: "Sanitätsdienst bei Veranstaltungen und Bereitschaftseinsätzen in ganz Baden-Württemberg.",
            },
            tags: [
                { label: { en: "First Aid",     de: "Erste Hilfe" }, color: "red" },
                { label: { en: "Event Medical", de: "Sanitätsdienst" }, color: "red" },
            ],
        },
    ],

    // ── Leadership & University ───────────────────────────────────────────────
    leadership: [
        {
            color: "purple",
            title: {
                en: "Head of Student Council",
                de: "Vorsitzender der Studierendenvertretung",
            },
            org:  { en: "TUM Campus Heilbronn · Student Council", de: "TUM Campus Heilbronn · Studierendenvertretung" },
            date: { en: "Dec 2024 – Present",                     de: "Dez. 2024 – heute" },
            desc: {
                en: "First democratically elected head of TUM Campus Heilbronn's student council, representing 1,000+ students across 6 departments. Established formal co-determination rights in university committees. Organises semester events, freshman orientations, and campus activities.",
                de: "Erster demokratisch gewählter Vorsitzender der Studierendenvertretung am TUM Campus Heilbronn. Vertretung von über 1.000 Studierenden in 6 Fachbereichen. Etablierung formeller Mitbestimmungsrechte in Hochschulgremien. Organisation von Semesterfeiern, Erstsemesterveranstaltungen und Campus-Events.",
            },
            tags: [
                { label: { en: "Leadership",     de: "Führung" },         color: "purple" },
                { label: { en: "Governance",     de: "Hochschulpolitik" }, color: "purple" },
                { label: { en: "1,000+ Students",de: "1.000+ Studierende" }, color: "purple" },
            ],
        },
        {
            color: "purple",
            title: { en: "Konrad-Adenauer Scholar",              de: "Stipendiat der Konrad-Adenauer-Stiftung" },
            org:   "Konrad-Adenauer-Stiftung",
            date:  { en: "Apr 2025 – Present",                   de: "Apr. 2025 – heute" },
            desc:  {
                en: "Selected for the KAS scholarship programme. Participating in political education seminars, leadership workshops, and the national scholar network.",
                de: "Aufnahme in das Stipendienprogramm der KAS. Teilnahme an politischen Bildungsseminaren, Führungsworkshops und dem bundesweiten Stipendiatennetzwerk.",
            },
            tags: [
                { label: { en: "Scholarship", de: "Stipendium" }, color: "purple" },
                { label: { en: "Politics",    de: "Politik" },     color: "purple" },
            ],
        },
    ],

    // ── Projects ──────────────────────────────────────────────────────────────
    projects: [
        {
            color: "blue",
            title: {
                en: "AI Chatbot for Enterprise Knowledge Management",
                de: "KI-Chatbot für unternehmensinternes Wissensmanagement",
            },
            desc: {
                en: "Designed and deployed an internal AI chatbot at Daimler Truck to surface institutional knowledge across departments. Integrated with existing document management systems via REST APIs.",
                de: "Konzeption und Deployment eines internen KI-Chatbots bei Daimler Truck zur abteilungsübergreifenden Wissensbereitstellung. Integration in bestehende Dokumentenmanagementsysteme via REST APIs.",
            },
            tags: [
                { label: "Python",   color: "blue" },
                { label: "AI / ML",  color: "blue" },
                { label: "REST APIs",color: "blue" },
            ],
        },
        {
            color: "blue",
            title: {
                en: "Unified Learning Platform – API Integration",
                de: "Einheitliche Lernplattform – API-Integration",
            },
            desc: {
                en: "Built a unified learning dashboard at Daimler Truck by connecting LinkedIn Learning, Oracle, and Udemy APIs, enabling centralised tracking of employee training progress.",
                de: "Entwicklung eines einheitlichen Lern-Dashboards bei Daimler Truck durch Anbindung von LinkedIn Learning, Oracle und Udemy APIs zur zentralen Verfolgung von Mitarbeiterfortschritten.",
            },
            tags: [
                { label: "Python",                                          color: "blue" },
                { label: { en: "System Integration", de: "Systemintegration" }, color: "blue" },
                { label: "REST APIs",                                       color: "blue" },
            ],
        },
        {
            color: "red",
            title: {
                en: "Drone Reconnaissance Unit – FF Ebenhausen",
                de: "Drohnenaufklärungsstaffel – FF Ebenhausen",
            },
            desc: {
                en: "Built and lead the drone unit at FF Ebenhausen-Schäftlarn from the ground up. Established operational procedures, trained personnel, and integrated drone footage into incident command workflows.",
                de: "Aufbau und Leitung der Drohnenstaffel der FF Ebenhausen-Schäftlarn. Erstellung von Einsatzkonzepten, Schulung von Personal und Integration von Drohnenaufnahmen in die Einsatzleitung.",
            },
            tags: [
                { label: { en: "Drone Ops",  de: "Drohnenbetrieb" }, color: "red" },
                { label: { en: "Operations", de: "Einsatzplanung" }, color: "red" },
            ],
        },
        {
            color: "purple",
            title: {
                en: "Student Council – Founding & Governance",
                de: "Studierendenvertretung – Gründung & Aufbau",
            },
            desc: {
                en: "Co-founded and structured TUM Campus Heilbronn's first democratically elected student council. Drafted bylaws, established committee representation, and created recurring event formats.",
                de: "Mitgründung und Strukturierung der ersten demokratisch gewählten Studierendenvertretung am TUM Campus Heilbronn. Erstellung der Satzung, Einrichtung von Gremienvertretungen und Aufbau wiederkehrender Veranstaltungsformate.",
            },
            tags: [
                { label: { en: "Governance",  de: "Hochschulpolitik" }, color: "purple" },
                { label: { en: "Leadership",  de: "Führung" },          color: "purple" },
            ],
        },
    ],

    // ── Volunteering ──────────────────────────────────────────────────────────
    volunteering: [
        {
            color: "purple",
            title: { en: "TUM Peer Mentor",                      de: "TUM Peer-Mentor" },
            desc:  {
                en: "Supporting incoming students with academic orientation and campus life at TUM Heilbronn.",
                de: "Unterstützung von Erstsemesterstudierenden bei der akademischen Orientierung und dem Campusleben am TUM Campus Heilbronn.",
            },
            tags: [],
        },
        {
            color: "green",
            title: { en: "Campus Event Organiser",               de: "Campus-Veranstaltungsorganisator" },
            desc:  {
                en: "Organising semester parties, freshman welcome events, and game nights for the TUM Heilbronn student community.",
                de: "Organisation von Semesterfeiern, Erstsemesterbegrüßungen und Spieleabenden für die Studierendengemeinschaft am TUM Campus Heilbronn.",
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
