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

/* ===========================================
   Data
=========================================== */

let contracts = [];

/* ===========================================
   Opstarten
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    console.log(`${APP.name} v${APP.version}`);

    await checkAppVersion();

    loadContracts();

    updateDashboard();

    registerServiceWorker();

});

/* ===========================================
   Dashboard
=========================================== */

function updateDashboard() {

    updateStatistics();

    renderContracts();

}

function updateStatistics() {

    const monthlyCosts = calculateMonthlyCosts();

    const monthlyElement = document.querySelector(".card h1");

    if (monthlyElement) {

        monthlyElement.textContent =
            "€" + monthlyCosts.toFixed(2).replace(".", ",");

    }

    const cards = document.querySelectorAll(".mini-card h2");

    if (cards.length >= 2) {

        cards[0].textContent = contracts.length;

        cards[1].textContent = contractsEndingSoon();

    }

}

/* ===========================================
   Contracten
=========================================== */

function renderContracts() {

    const container = document.getElementById("contracts");

    if (!container) return;

    if (contracts.length === 0) {

        container.innerHTML = `
            <div class="empty-card">
                Nog geen contracten toegevoegd.
            </div>
        `;

        return;

    }

    container.innerHTML = "";

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
   Berekeningen
=========================================== */

function calculateMonthlyCosts() {

    let total = 0;

    contracts.forEach(contract => {

        switch (contract.frequency) {

            case "monthly":
                total += contract.amount;
                break;

            case "yearly":
                total += contract.amount / 12;
                break;

            default:
                total += contract.amount;

        }

    });

    return total;

}

function contractsEndingSoon() {

    const today = new Date();

    let count = 0;

    contracts.forEach(contract => {

        const end = new Date(contract.endDate);

        const diff = (end - today) / (1000 * 60 * 60 * 24);

        if (diff >= 0 && diff <= 30) {

            count++;

        }

    });

    return count;

}

/* ===========================================
   Local Storage
=========================================== */

function loadContracts() {

    const savedContracts = localStorage.getItem("contracts");

    if (savedContracts) {

        contracts = JSON.parse(savedContracts);

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
   Contractbeheer
=========================================== */

function addContract(contract) {

    contracts.push(contract);

    saveContracts();

    updateDashboard();

}

function deleteContract(id) {

    contracts = contracts.filter(contract => contract.id !== id);

    saveContracts();

    updateDashboard();

}

/* ===========================================
   Service Worker
=========================================== */

function registerServiceWorker() {

    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
        .register("./sw.js")
        .then(registration => {

            console.log("Service Worker geregistreerd");

            registration.update();

        })
        .catch(error => {

            console.error(error);

        });

}

/* ===========================================
   Versiecontrole
=========================================== */

async function checkAppVersion() {

    try {

        const response = await fetch("./version.json?t=" + Date.now());

        const online = await response.json();

        if (APP.debug) {

            console.log("Lokale versie :", APP.version);
            console.log("Online versie :", online.version);

            console.log("Lokale build :", APP.build);
            console.log("Online build :", online.build);

        }

        if (online.build > APP.build) {

            const update = confirm(

                `Er is een nieuwe versie van ContractKeeper beschikbaar.

Versie ${online.version}

Wil je de app vernieuwen?`

            );

            if (update) {

                if ("serviceWorker" in navigator) {

                    const registrations =
                        await navigator.serviceWorker.getRegistrations();

                    for (const registration of registrations) {

                        await registration.unregister();

                    }

                }

                localStorage.clear();

                caches.keys().then(keys => {

                    keys.forEach(key => caches.delete(key));

                });

                window.location.reload();

            }

        }

    } catch (error) {

        console.warn("Versiecontrole niet beschikbaar.");

    }

}
