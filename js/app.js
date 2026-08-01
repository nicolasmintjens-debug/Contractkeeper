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

    // Service Worker registreren
    registerServiceWorker();

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

function initNavigation() {

    const homeButton = document.getElementById("nav-home");
    const contractsButton = document.getElementById("nav-contracts");
    const insightsButton = document.getElementById("nav-insights");
    const settingsButton = document.getElementById("nav-settings");

    const homeSection = document.getElementById("homeSection");
    const contractsSection = document.getElementById("contractsSection");
    const insightsSection = document.getElementById("insightsSection");
    const settingsSection = document.getElementById("settingsSection");

    function hideAllPages() {

        homeSection.style.display = "none";
        contractsSection.style.display = "none";
        insightsSection.style.display = "none";
        settingsSection.style.display = "none";

    }

    if (homeButton) {

        homeButton.addEventListener("click", () => {

            hideAllPages();

            homeSection.style.display = "block";
            contractsSection.style.display = "block";

            setActiveNav("nav-home");

        });

    }

    if (contractsButton) {

        contractsButton.addEventListener("click", () => {

            hideAllPages();

            contractsSection.style.display = "block";

            setActiveNav("nav-contracts");

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
