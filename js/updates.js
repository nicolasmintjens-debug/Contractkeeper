/* ==========================================================
   ContractKeeper
   updates.js
========================================================== */

const APP_VERSION = "0.1.1";

function initAppVersion() {

    const versionElement =
        document.getElementById("settingsVersion");

    if (!versionElement) return;

    versionElement.textContent =
        APP_VERSION;

}

/* ==========================================================
   CONTROLEREN OP UPDATES
========================================================== */

async function checkAppVersion(showMessage = false) {

    try {

        const response =
            await fetch(
                `version.json?t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error("version.json kon niet worden geladen.");
        }

        const data =
            await response.json();

        const latestVersion =
            data.version;

        if (!latestVersion) {
            throw new Error("Geen versienummer gevonden.");
        }

        if (latestVersion !== APP_VERSION) {

            alert(
                `Er is een nieuwe versie van ContractKeeper beschikbaar.\n\n` +
                `Huidige versie: ${APP_VERSION}\n` +
                `Nieuwe versie: ${latestVersion}`
            );

            return;
        }

        if (showMessage) {

            alert(
                `ContractKeeper is up-to-date.\n\n` +
                `Versie ${APP_VERSION}`
            );

        }

    } catch (error) {

        console.error(
            "Updatecontrole mislukt:",
            error
        );

        if (showMessage) {

            alert(
                "De updatecontrole kon niet worden uitgevoerd."
            );

        }

    }

}