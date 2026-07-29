/* ===========================================
   ContractKeeper
   app.js
=========================================== */

const APP = {
    name: "ContractKeeper",
    version: "0.1.0",
    build: 1,
    debug: true
};

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {

    console.log(`${APP.name} v${APP.version}`);

    // Controleer op nieuwe versie
    if (typeof checkAppVersion === "function") {
        await checkAppVersion();
    }

    // Contracten laden
    if (typeof loadContracts === "function") {
        loadContracts();
    }

    // Dashboard tekenen
    if (typeof renderContracts === "function") {
        renderContracts();
    }

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    // Service Worker
    registerServiceWorker();

    // Modal initialiseren
    if (typeof initModal === "function") {
        initModal();
    }

}

/* ===========================================
   Service Worker
=========================================== */

function registerServiceWorker() {

    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
        .register("./sw.js")
        .then(() => {

            if (APP.debug) {
                console.log("✅ Service Worker actief");
            }

        })
        .catch(console.error);

}
