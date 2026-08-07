/* ==========================================================
   ContractKeeper
   app.js
========================================================== */

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {

    console.log("🚀 ContractKeeper gestart");

    // Demo-data toevoegen bij eerste opstart
    Storage.seed();

    // Updates controleren
    if (typeof checkAppVersion === "function") {
        await checkAppVersion();
    }

    // Contracten tonen
    if (typeof renderContracts === "function") {
        renderContracts();
    }

    // Dashboard bijwerken
    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    // Modal initialiseren
    if (typeof initModal === "function") {
        initModal();
    }

  // Navigatie initialiseren
if (typeof initNavigation === "function") {
    initNavigation();
}

// CK AI initialiseren
initAI();

if (typeof initCKAIResult === "function") {
    initCKAIResult();
}

// Service Worker registreren
registerServiceWorker();

updateCurrentDate();
   
}



/* ==========================================================
   Service Worker
========================================================== */

function registerServiceWorker() {

    if (!("serviceWorker" in navigator)) {
        return;
    }

    navigator.serviceWorker
        .register("sw.js")
        .then(() => {

            console.log("✅ Service Worker geregistreerd");

        })
        .catch(error => {

            console.error("❌ Service Worker fout:", error);

        });

}

const sortButton = document.getElementById("sortContracts");
const sortSheet = document.getElementById("sortSheet");
const closeSortSheet = document.getElementById("closeSortSheet");

sortButton.addEventListener("click", () => {
    sortSheet.classList.add("show");
});

closeSortSheet.addEventListener("click", () => {
    sortSheet.classList.remove("show");
});

sortSheet.addEventListener("click", (e) => {
    if (e.target === sortSheet) {
        sortSheet.classList.remove("show");
    }
});

document.querySelectorAll(".sort-option").forEach(button => {

    button.addEventListener("click", () => {

        currentSort = button.dataset.sort;

        document.querySelectorAll(".sort-option").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        sortSheet.classList.remove("show");

        renderContracts();

    });

});

/* ==========================================================
   NAVIGATIE
========================================================== */

function setActiveNav(buttonId) {

    document.querySelectorAll(".bottom-nav button").forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(buttonId)?.classList.add("active");

}

/* ==========================================================
   VERBERG ALLE PAGINA'S
========================================================== */

function hideAllPages() {

    document.getElementById("homeSection").style.display = "none";
    document.getElementById("contractsSection").style.display = "none";
    document.getElementById("insightsSection").style.display = "none";
    document.getElementById("settingsSection").style.display = "none";
    document.getElementById("page-ckai").style.display = "none";

}

function initNavigation() {

    const homeButton = document.getElementById("nav-home");
    const contractsButton = document.getElementById("nav-contracts");
    const insightsButton = document.getElementById("nav-insights");
    const settingsButton = document.getElementById("nav-settings");

const homeSection = document.getElementById("homeSection");
const contractsSection = document.getElementById("contractsSection");
const insightsSection = document.getElementById("insightsSection");
const settingsSection = document.getElementById("settingsSection");

/* ==========================================================
   OPEN PAGINA
========================================================== */

function openPage(page) {

    hideAllPages();

    switch (page) {

        case "home":
            homeSection.style.display = "block";
            setActiveNav("nav-home");
            break;

        case "contracts":
            contractsSection.style.display = "block";
            setActiveNav("nav-contracts");
            break;

        case "insights":
            insightsSection.style.display = "block";
            setActiveNav("nav-insights");
            break;

        case "settings":
            settingsSection.style.display = "block";
            setActiveNav("nav-settings");
            break;

    }

}



    if (homeButton) {

   homeButton.addEventListener("click", () => {

    hideAllPages();

    homeSection.style.display = "block";

    setActiveNav("nav-home");

});

}
   
    if (contractsButton) {

        contractsButton.addEventListener("click", () => {

    currentDashboardFilter = "";

    hideAllPages();

    contractsSection.style.display = "block";

    setActiveNav("nav-contracts");

    console.log("Contracten opnieuw gerenderd");

renderContracts();

});

    }

    if (insightsButton) {

        insightsButton.addEventListener("click", () => {

            hideAllPages();

            insightsSection.style.display = "block";

            setActiveNav("nav-insights");

        });

    }

    if (settingsButton) {

        settingsButton.addEventListener("click", () => {

            hideAllPages();

            settingsSection.style.display = "block";

            setActiveNav("nav-settings");

        });

    }

}

/* ==========================================================
   HUIDIGE DATUM
========================================================== */

function updateCurrentDate() {

    const element = document.getElementById("currentDate");

    if (!element) return;

    const today = new Date();

    const days = [
        "Zondag",
        "Maandag",
        "Dinsdag",
        "Woensdag",
        "Donderdag",
        "Vrijdag",
        "Zaterdag"
    ];

    const months = [
        "januari",
        "februari",
        "maart",
        "april",
        "mei",
        "juni",
        "juli",
        "augustus",
        "september",
        "oktober",
        "november",
        "december"
    ];

    element.textContent =
        `${days[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]}`;

}

/* ==========================================================
   CK AI
========================================================== */

function initAI() {

    document.querySelectorAll(".ai-button").forEach(button => {

        button.addEventListener("click", openAI);

    });

}

function openAI() {

    openCKAI();

}
