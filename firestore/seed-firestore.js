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
        en: "Studying Information Engineering at TU Munich. Working student at Daimler Truck. Active volunteer firefighter, paramedic, and Head of TUM Campus Heilbronn Student Council. Konrad-Adenauer Scholar.",
        de: "Studium der Informationstechnik an der TU München. Werkstudent bei Daimler Truck. Aktiver Feuerwehrmann, Sanitäter und Vorsitzender der Studierendenvertretung am TUM Campus Heilbronn. Stipendiat der Konrad-Adenauer-Stiftung.",
    },

    languages: [
        { name: { en: "German",  de: "Deutsch"  }, level: { en: "Native",         de: "Muttersprache" } },
        { name: { en: "English", de: "Englisch" }, level: { en: "C1 – Cambridge",  de: "C1 – Cambridge" } },
        { name: "Latin",                           level: { en: "B1",              de: "B1" } },
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
            title: { en: "Drone Pilot License A1/A3",    de: "Drohnenführerschein A1/A3" },
            org:   "LBA · 2023",
        },
        {
            title: { en: "Driving Licence B",            de: "Führerschein Klasse B" },
            org:   "",
        },
    ],

    // ── Education ─────────────────────────────────────────────────────────────
    education: [
        {
            color: "blue",
            title: { en: "B.Sc. Information Engineering",  de: "B.Sc. Informationstechnik" },
            org:   { en: "Technical University of Munich · Campus Heilbronn", de: "Technische Universität München · Campus Heilbronn" },
            date:  { en: "Oct 2024 – Present",             de: "Okt. 2024 – heute" },
            desc:  {
                en: "Interdisciplinary programme combining computer science, electrical engineering, and management. Konrad-Adenauer Scholar since April 2025.",
                de: "Interdisziplinäres Studium aus Informatik, Elektrotechnik und Betriebswirtschaft. Stipendiat der Konrad-Adenauer-Stiftung seit April 2025.",
            },
            tags: [
                { label: "TUM",       color: "blue" },
                { label: { en: "Scholarship", de: "Stipendium" }, color: "blue" },
            ],
        },
        {
            color: "default",
            title: { en: "B.Sc. Business Informatics (transferred)", de: "B.Sc. Wirtschaftsinformatik (gewechselt)" },
            org:   { en: "University of Applied Sciences Munich", de: "Hochschule München" },
            date:  { en: "Oct 2023 – Sep 2024", de: "Okt. 2023 – Sep. 2024" },
            desc:  {
                en: "First year before transferring to TUM Heilbronn.",
                de: "Erstes Studienjahr vor dem Wechsel an die TUM Heilbronn.",
            },
            tags: [],
        },
        {
            color: "default",
            title: { en: "Abitur (High School Diploma)", de: "Abitur" },
            org:   "Rainer-Maria-Rilke-Gymnasium Icking",
            date:  { en: "2016 – 2023", de: "2016 – 2023" },
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
            title: { en: "Working Student – Learning Academy",  de: "Werkstudent – Learning Academy" },
            org:   "Daimler Truck AG · Stuttgart",
            date:  { en: "Apr 2025 – Present", de: "Apr. 2025 – heute" },
            desc:  {
                en: "Developing the internal administration tool for the Learning Academy and implementing new features. Connecting learning provider APIs (LinkedIn Learning, Oracle, Udemy) to make all company courses available in the new AI tools.",
                de: "Weiterentwicklung des internen Verwaltungstools der Learning Academy und Implementierung neuer Funktionen. Anbindung von Lernanbieter-APIs (LinkedIn Learning, Oracle, Udemy), um alle Unternehmenskurse in den neuen KI-Tools verfügbar zu machen.",
            },
            tags: [
                { label: "Python",    color: "blue" },
                { label: "REST APIs", color: "blue" },
                { label: "AI / ML",   color: "blue" },
            ],
        },
        {
            color: "blue",
            title: { en: "Working Student – Data Protection & Information Security", de: "Werkstudent – Datenschutz & Informationssicherheit" },
            org:   "MVI ProMind GmbH · Munich",
            date:  { en: "Jan 2024 – Jun 2024", de: "Jan. 2024 – Jun. 2024" },
            desc:  {
                en: "Supporting automotive suppliers in TISAX certification. Assisting the data protection coordinator and applying ISO 27001 to customer documents.",
                de: "Unterstützung von Automobilzulieferern bei der TISAX-Zertifizierung. Mitarbeit beim Datenschutzbeauftragten und Anwendung von ISO 27001 auf Kundendokumente.",
            },
            tags: [
                { label: "TISAX",     color: "blue" },
                { label: "ISO 27001", color: "blue" },
            ],
        },
        {
            color: "default",
            title: { en: "Ski Instructor (Level 1)", de: "Skilehrer (Stufe 1)" },
            org:   "Schneesportschule Isartal",
            date:  { en: "Feb 2024", de: "Feb. 2024" },
            desc:  {
                en: "Teaching a blue advanced group during a week-long course with pupils of different age groups.",
                de: "Unterricht einer blauen Fortgeschrittenengruppe in einem einwöchigen Kurs mit Schülerinnen und Schülern verschiedener Altersgruppen.",
            },
            tags: [],
        },
        {
            color: "default",
            title: { en: "Recording Assistant", de: "Aufnahmeassistent" },
            org:   { en: "Audiamus Recording Studio · Munich", de: "Audiamus Tonstudio · München" },
            date:  { en: "Nov 2022", de: "Nov. 2022" },
            desc:  {
                en: "Recording support for a classical music CD in several Munich churches and the Herkulessaal.",
                de: "Aufnahmeunterstützung für eine klassische Musik-CD in mehreren Münchner Kirchen und im Herkulessaal.",
            },
            tags: [],
        },
    ],

    // ── Emergency Services ────────────────────────────────────────────────────
    emergency: [
        {
            color: "red",
            title: { en: "Paramedic Training", de: "Notfallsanitäter-Ausbildung" },
            org:   "Arbeiter-Samariter-Bund Baden-Württemberg · Heilbronn / Mannheim",
            date:  { en: "Sep 2025 – Present", de: "Sep. 2025 – heute" },
            desc:  {
                en: "520-hour training programme qualifying as a responsible specialist in patient transport and emergency rescue, in accordance with the Federal-State Committee for Rescue Services guidelines.",
                de: "520-stündige Ausbildung zur verantwortlichen Fachkraft im Krankentransport und Rettungsdienst gemäß den Richtlinien des Bund-Länder-Ausschusses für den Rettungsdienst.",
            },
            tags: [
                { label: { en: "Paramedic", de: "Notfallsanitäter" }, color: "red" },
            ],
        },
        {
            color: "red",
            title: { en: "Hospital Internship – Paramedic", de: "Krankenhauspraktikum – Notfallsanitäter" },
            org:   { en: "Augsburg University Hospital", de: "Universitätsklinikum Augsburg" },
            date:  { en: "Mar – Apr 2026", de: "Mär. – Apr. 2026" },
            desc:  {
                en: "Rotations in anaesthesia/surgery, intensive care, and emergency room. Establishing access, intubation, patient mobilisation, and emergency admissions under medical supervision.",
                de: "Einsätze in Anästhesie/OP, Intensivstation und Notaufnahme. Zugänge legen, Intubation, Patientenmobilisation und Notaufnahme unter ärztlicher Aufsicht.",
            },
            tags: [
                { label: { en: "Emergency Room", de: "Notaufnahme" }, color: "red" },
                { label: { en: "ICU", de: "Intensivstation" }, color: "red" },
            ],
        },
        {
            color: "red",
            title: { en: "Firefighter", de: "Feuerwehrmann" },
            org:   "Freiwillige Feuerwehr Heilbronn Stadt",
            date:  { en: "Nov 2024 – Present", de: "Nov. 2024 – heute" },
            desc:  {
                en: "Active volunteer firefighter supporting the Heilbronn City Fire Department in large-scale operations.",
                de: "Aktiver Feuerwehrmann zur Unterstützung der Feuerwehr Heilbronn bei Großeinsätzen.",
            },
            tags: [
                { label: { en: "Firefighting", de: "Brandbekämpfung" }, color: "red" },
            ],
        },
        {
            color: "red",
            title: { en: "Paramedic – Event Medical Service", de: "Sanitäter – Veranstaltungssanitätsdienst" },
            org:   "Sanitätsteam BW e.V. · Heilbronn & Stuttgart",
            date:  { en: "Oct 2024 – Present", de: "Okt. 2024 – heute" },
            desc:  {
                en: "Medical support at events ranging from Harmonie Heilbronn to the New Year's Eve celebration at Schlossplatz Stuttgart.",
                de: "Sanitätsdienst bei Veranstaltungen von der Harmonie Heilbronn bis zur Silvesterfeier am Schlossplatz Stuttgart.",
            },
            tags: [
                { label: { en: "Event Medical", de: "Sanitätsdienst" }, color: "red" },
            ],
        },
        {
            color: "red",
            title: { en: "Oktoberfest Medical Service", de: "Oktoberfest Sanitätsdienst" },
            org:   "Aicher Ambulance Union · Munich",
            date:  { en: "Sep – Oct 2024 & 2025", de: "Sep. – Okt. 2024 & 2025" },
            desc:  {
                en: "87 hours in 2024 and 123 hours in 2025. Deployed on stretcher, in the container and marquee, in monitoring, on night duty, and in CT.",
                de: "87 Stunden 2024 und 123 Stunden 2025. Einsatz auf der Trage, im Container und Zelt, in der Überwachung, im Nachtdienst und im CT.",
            },
            tags: [
                { label: "Oktoberfest", color: "red" },
            ],
        },
        {
            color: "red",
            title: { en: "Firefighter, Drone Squadron Head & IT Admin", de: "Feuerwehrmann, Drohnenstaffelleiter & IT-Admin" },
            org:   "FF Ebenhausen-Schäftlarn & FF Hohenschäftlarn",
            date:  { en: "Jul 2021 – Present", de: "Jul. 2021 – heute" },
            desc:  {
                en: "Active since 2021. First responder since 2023. Leading the drone unit for aerial reconnaissance and managing all IT infrastructure.",
                de: "Aktiv seit 2021. Ersthelfer seit 2023. Leitung der Drohnenstaffel für Luftaufklärung und Verwaltung der gesamten IT-Infrastruktur.",
            },
            tags: [
                { label: { en: "Drone Ops", de: "Drohnenbetrieb" }, color: "red" },
                { label: { en: "IT Admin",  de: "IT-Administration" }, color: "red" },
            ],
        },
        {
            color: "red",
            title: { en: "First Responder Training", de: "Ersthelfer-Ausbildung" },
            org:   { en: "Kreisbrandinspektion – County of Munich", de: "Kreisbrandinspektion Landkreis München" },
            date:  { en: "Jan – Mar 2024", de: "Jan. – Mär. 2024" },
            desc:  {
                en: "Extended paramedic training for firefighters. Theoretical and practical training over multiple weekends.",
                de: "Erweiterte Sanitätsausbildung für Feuerwehrangehörige. Theoretische und praktische Ausbildung über mehrere Wochenenden.",
            },
            tags: [],
        },
    ],

    // ── Leadership & University ───────────────────────────────────────────────
    leadership: [
        {
            color: "purple",
            title: { en: "Head of Student Council", de: "Vorsitzender der Studierendenvertretung" },
            org:   { en: "TUM Campus Heilbronn", de: "TUM Campus Heilbronn" },
            date:  { en: "Dec 2024 – Present", de: "Dez. 2024 – heute" },
            desc:  {
                en: "First democratically elected Head of TUM Campus Heilbronn's student council. Representing all students in university committees and building up co-determination rights.",
                de: "Erster demokratisch gewählter Vorsitzender der Studierendenvertretung am TUM Campus Heilbronn. Vertretung aller Studierenden in Hochschulgremien und Aufbau von Mitbestimmungsrechten.",
            },
            tags: [
                { label: { en: "Leadership", de: "Führung" }, color: "purple" },
            ],
        },
        {
            color: "purple",
            title: { en: "Konrad-Adenauer Scholar", de: "Stipendiat der Konrad-Adenauer-Stiftung" },
            org:   "Konrad-Adenauer-Stiftung",
            date:  { en: "Apr 2025 – Present", de: "Apr. 2025 – heute" },
            desc:  {
                en: "Selected for the KAS scholarship programme. Participating in political education seminars, leadership workshops, and the national scholar network.",
                de: "Aufnahme in das Stipendienprogramm der KAS. Teilnahme an politischen Bildungsseminaren, Führungsworkshops und dem bundesweiten Stipendiatennetzwerk.",
            },
            tags: [
                { label: { en: "Scholarship", de: "Stipendium" }, color: "purple" },
            ],
        },
        {
            color: "purple",
            title: { en: "System Administrator", de: "Systemadministrator" },
            org:   "apropolis e.V.",
            date:  { en: "Oct 2023 – Present", de: "Okt. 2023 – heute" },
            desc:  {
                en: "Managing the website, Nextcloud instance, NocoDB database, and Microsoft 365 organisation. Currently building an SSO solution with Microsoft 365 for all apropolis services.",
                de: "Verwaltung der Website, Nextcloud-Instanz, NocoDB-Datenbank und Microsoft 365-Organisation. Aktuell Aufbau einer SSO-Lösung mit Microsoft 365 für alle apropolis-Dienste.",
            },
            tags: [
                { label: "Nextcloud",      color: "purple" },
                { label: "Microsoft 365",  color: "purple" },
                { label: "SSO",            color: "purple" },
            ],
        },
        {
            color: "default",
            title: { en: "Bundeswehr – Basic Training (IT Battalion 292)", de: "Bundeswehr – Grundausbildung (IT-Bataillon 292)" },
            org:   { en: "Federal Armed Forces of Germany · Dillingen a.d. Donau", de: "Bundeswehr · Dillingen an der Donau" },
            date:  { en: "Jul – Oct 2023", de: "Jul. – Okt. 2023" },
            desc:  {
                en: "Completed basic training in the Cyber and Information Domain Service. Weapons training, field exercises, first-aider alpha qualification, and oath of service.",
                de: "Abgeschlossene Grundausbildung im Cyber- und Informationsdomänenraum. Waffenausbildung, Geländeübungen, Ersthelfer-Alpha-Qualifikation und Vereidigung.",
            },
            tags: [
                { label: { en: "Cyber Defence", de: "Cyber-Abwehr" }, color: "default" },
            ],
        },
    ],

    // ── Projects ──────────────────────────────────────────────────────────────
    projects: [
        {
            color: "blue",
            title: { en: "AI Course Finder – Daimler Truck (Campus Founders)", de: "KI-Kursfinder – Daimler Truck (Campus Founders)" },
            desc:  {
                en: "Developed a working AI solution with a team at the Campus Founders Corporate Campus Challenge to help Daimler Truck employees find relevant training courses. Oct 2024 – Jan 2025.",
                de: "Entwicklung einer funktionierenden KI-Lösung im Team beim Campus Founders Corporate Campus Challenge, um Daimler Truck-Mitarbeitern das Auffinden relevanter Schulungen zu erleichtern. Okt. 2024 – Jan. 2025.",
            },
            tags: [
                { label: "AI / ML",   color: "blue" },
                { label: "Python",    color: "blue" },
            ],
        },
        {
            color: "blue",
            title: { en: "PoliTech Hackathon – ML for Political Responsibility", de: "PoliTech Hackathon – ML für politische Verantwortung" },
            desc:  {
                en: "9-hour hackathon at Urban Innovation Hub Heilbronn (Jun 2025). Developed an ML solution to allocate political responsibilities. GitHub: github.com/alexhou00/HackathonChallengeOne",
                de: "9-stündiger Hackathon im Urban Innovation Hub Heilbronn (Jun. 2025). Entwicklung einer ML-Lösung zur Zuweisung politischer Verantwortlichkeiten.",
            },
            tags: [
                { label: "ML",        color: "blue" },
                { label: "Hackathon", color: "blue" },
            ],
        },
        {
            color: "purple",
            title: { en: "Schüler Connect – Student Project (€47,000 funded)", de: "Schüler Connect – Schülerprojekt (47.000 € gefördert)" },
            desc:  {
                en: "Initiated and managed a student project during the COVID pandemic, funded by the Bavarian Youth Ring, JFF, and State Ministry of Labour with €47,000. App connecting pupils across districts for joint events. 2021–2023.",
                de: "Initiierung und Leitung eines Schülerprojekts während der Corona-Pandemie, gefördert vom Bayerischen Jugendring, JFF und Staatsministerium für Arbeit mit 47.000 €. App zur schulübergreifenden Vernetzung von Schülerinnen und Schülern. 2021–2023.",
            },
            tags: [
                { label: { en: "Project Management", de: "Projektmanagement" }, color: "purple" },
                { label: { en: "Funded", de: "Gefördert" }, color: "purple" },
            ],
        },
        {
            color: "green",
            title: { en: "Maifeier Ebenhausen – Website & Raspberry Pi Setup", de: "Maifeier Ebenhausen – Website & Raspberry Pi" },
            desc:  {
                en: "Built the event website and set up a Raspberry Pi for camera and music control at the Maifeier 2024. maifeier-ebenhausen.de",
                de: "Erstellung der Veranstaltungswebsite und Einrichtung eines Raspberry Pi für Kamera- und Musiksteuerung bei der Maifeier 2024.",
            },
            tags: [
                { label: "Raspberry Pi", color: "green" },
                { label: "Web",          color: "green" },
            ],
        },
    ],

    // ── Volunteering & Social ─────────────────────────────────────────────────
    volunteering: [
        {
            color: "purple",
            title: { en: "Participant – \"Der Staat bist du\" (ForViD e.V.)", de: "Teilnehmer – \"Der Staat bist du\" (ForViD e.V.)" },
            desc:  {
                en: "Parliamentary simulation at DHL Logistics Centre Leipzig (Nov 2024). Re-enacted Bundestag legislative process and discussed topics with experts from Saxony's politics, economy, and medicine.",
                de: "Parlamentssimulation im DHL-Logistikzentrum Leipzig (Nov. 2024). Nachstellung des Bundestagsgesetzgebungsverfahrens und Diskussion mit Experten aus Sachsens Politik, Wirtschaft und Medizin.",
            },
            tags: [],
        },
        {
            color: "purple",
            title: { en: "Theme Table Moderator – 24h Discussion (ForViD e.V.)", de: "Tischmoderation – 24h-Diskussion (ForViD e.V.)" },
            desc:  {
                en: "Invited as participant and moderator at the 24h discussion in the Saxon State Parliament with Minister President Michael Kretschmer (Dec 2023).",
                de: "Eingeladen als Teilnehmer und Moderator bei der 24h-Diskussion im Sächsischen Landtag mit Ministerpräsident Michael Kretschmer (Dez. 2023).",
            },
            tags: [],
        },
        {
            color: "purple",
            title: { en: "YouMeCon Berlin 2024 – AI in Journalism", de: "YouMeCon Berlin 2024 – KI im Journalismus" },
            desc:  {
                en: "Participated in the Youth Media Convention of Jugendpresse Deutschland e.V. (Mar 2024). Highlight: presentation by journalists from the ARD capital studio.",
                de: "Teilnahme an der Youth Media Convention der Jugendpresse Deutschland e.V. (Mär. 2024). Highlight: Präsentation von Journalisten aus dem ARD-Hauptstadtstudio.",
            },
            tags: [],
        },
        {
            color: "default",
            title: { en: "Headboy (Student Representative)", de: "Schülersprecher" },
            org:   "Rainer-Maria-Rilke-Gymnasium Icking",
            desc:  {
                en: "Elected student representative in 2020/21 and 2021/22. Represented students in the school forum. Gave a speech at the school's 150th anniversary celebration.",
                de: "Gewählter Schülersprecher 2020/21 und 2021/22. Vertretung der Schülerschaft im Schulforum. Rede beim 150-jährigen Schuljubiläum.",
            },
            tags: [],
        },
        {
            color: "default",
            title: { en: "Head of Technology & Video Team", de: "Leiter des Technik- und Videoteams" },
            org:   "Rainer-Maria-Rilke-Gymnasium Icking",
            desc:  {
                en: "Involved in the school's technology and video working group 2018–2023, leading the team from 2020. Organised and implemented school events.",
                de: "Mitglied der Technik- und Video-AG 2018–2023, Teamleitung ab 2020. Organisation und Durchführung von Schulveranstaltungen.",
            },
            tags: [],
        },
        {
            color: "default",
            title: { en: "Marketing Manager – Abitur Newspaper", de: "Marketingmanager – Abiturzeitung" },
            org:   "Rainer-Maria-Rilke-Gymnasium Icking",
            desc:  {
                en: "Financed 80% of the Abitur newspaper costs through advertising. 2022–2023.",
                de: "80 % der Kosten der Abiturzeitung durch Werbung finanziert. 2022–2023.",
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
