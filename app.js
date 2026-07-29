/* ===========================================
   ContractKeeper
   app.js
   Version 0.1.0
=========================================== */

const APP = {
    name: "ContractKeeper",
    version: "0.1.0",
    build: 1,
    debug: true
};

let contracts = [];

/* ===========================================
   START
=========================================== */

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {

    console.log(`${APP.name} v${APP.version}`);

    await checkAppVersion();

    loadContracts();

    renderContracts();

    updateDashboard();

    registerServiceWorker();

    initModal();

}

/* ===========================================
   DASHBOARD
=========================================== */

function updateDashboard() {

    const monthlyElement = document.querySelector(".card h1");
    const miniCards = document.querySelectorAll(".mini-card h2");

    const monthly = calculateMonthlyCosts();

    if (monthlyElement) {

        monthlyElement.textContent =
            "€" + monthly.toFixed(2).replace(".", ",");

    }

    if (miniCards.length >= 2) {

        miniCards[0].textContent = contracts.length;
        miniCards[1].textContent = contractsEndingSoon();

    }

}

/* ===========================================
   CONTRACTEN
=========================================== */

function renderContracts() {

    const container = document.getElementById("contracts");

    if (!container) return;

    container.innerHTML = "";

    if (contracts.length === 0) {

        container.innerHTML = `
            <div class="empty-card">
                Nog geen contracten toegevoegd.
            </div>
        `;

        return;

    }

    contracts.forEach(contract => {

        container.innerHTML += `

        <div class="contract-card">

            <div>

                <h4>${contract.name}</h4>
                <p>${contract.category}</p>

            </div>

            <div class="price">

                €${contract.amount.toFixed(2).replace(".", ",")}

            </div>

        </div>

        `;

    });

}

/* ===========================================
   BEREKENINGEN
=========================================== */

function calculateMonthlyCosts() {

    let total = 0;

    contracts.forEach(contract => {

        if (contract.frequency === "yearly") {

            total += contract.amount / 12;

        } else {

            total += contract.amount;

        }

    });

    return total;

}

function contractsEndingSoon() {

    let count = 0;

    const today = new Date();

    contracts.forEach(contract => {

        if (!contract.endDate) return;

        const end = new Date(contract.endDate);

        const diff = (end - today) / (1000 * 60 * 60 * 24);

        if (diff >= 0 && diff <= 30) {

            count++;

        }

    });

    return count;

}

/* ===========================================
   LOCAL STORAGE
=========================================== */

function loadContracts() {

    const saved = localStorage.getItem("contracts");

    if (saved) {

        contracts = JSON.parse(saved);

        return;

    }

    contracts = [

        {
            id: 1,
            name: "Netflix",
            category: "Entertainment",
            amount: 14.99,
            frequency: "monthly",
            endDate: "2027-01-01"
        },

        {
            id: 2,
            name: "Proximus",
            category: "Internet",
            amount: 69.99,
            frequency: "monthly",
            endDate: "2026-12-31"
        }

    ];

    saveContracts();

}

function saveContracts() {

    localStorage.setItem(
        "contracts",
        JSON.stringify(contracts)
    );

}

/* ===========================================
   CONTRACTBEHEER
=========================================== */

function addContract(contract) {

    contracts.push(contract);

    saveContracts();

    renderContracts();

    updateDashboard();

}

function deleteContract(id) {

    contracts = contracts.filter(c => c.id !== id);

    saveContracts();

    renderContracts();

    updateDashboard();

}

/* ===========================================
   MODAL
=========================================== */

function initModal() {

    const modal = document.getElementById("addContractModal");
    const button = document.getElementById("nav-add");

    if (!modal || !button) {

        console.warn("Modal niet gevonden.");
        return;

    }

    button.addEventListener("click", () => {

        modal.classList.add("show");

    });

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.classList.remove("show");

        }

    });

}

/* ===========================================
   SERVICE WORKER
=========================================== */

function registerServiceWorker() {

    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("./sw.js")
        .then(() => {

            console.log("Service Worker actief");

        })
        .catch(console.error);

}

/* ===========================================
   VERSIECONTROLE
=========================================== */

async function checkAppVersion() {

    try {

        const response =
            await fetch("./version.json?t=" + Date.now());

        const online = await response.json();

        if (APP.debug) {

            console.log("Lokale build :", APP.build);
            console.log("Online build :", online.build);

        }

        if (online.build > APP.build) {

            console.log("Nieuwe versie beschikbaar.");

        }

    }

    catch {

        console.log("Geen versiecontrole.");

    }

}
