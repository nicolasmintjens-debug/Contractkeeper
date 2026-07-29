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

/* ===========================================
   Voorbeeldcontracten
=========================================== */

let contracts = [
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

/* ===========================================
   Initialiseren
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log(`${APP.name} v${APP.version}`);

    loadContracts();

    updateDashboard();

    registerServiceWorker();

});

/* ===========================================
   Dashboard
=========================================== */

function updateDashboard() {

    const total = calculateMonthlyCosts();

    const active = contracts.length;

    const monthlyElement = document.querySelector(".card h1");

    if(monthlyElement){

        monthlyElement.textContent =
            "€" + total.toFixed(2).replace(".", ",");

    }

    const miniCards = document.querySelectorAll(".mini-card h2");

    if(miniCards.length >= 2){

        miniCards[0].textContent = active;

        miniCards[1].textContent = contractsEndingSoon();

    }

    renderContracts();

}

/* ===========================================
   Berekeningen
=========================================== */

function calculateMonthlyCosts(){

    let total = 0;

    contracts.forEach(contract => {

        switch(contract.frequency){

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

function contractsEndingSoon(){

    const today = new Date();

    let count = 0;

    contracts.forEach(contract=>{

        const end = new Date(contract.endDate);

        const diff = (end-today)/(1000*60*60*24);

        if(diff <=30 && diff>=0){

            count++;

        }

    });

    return count;

}

/* ===========================================
   Contracten tonen
=========================================== */

function renderContracts(){

    const container = document.getElementById("contracts");

    if(!container) return;

    container.innerHTML="";

    contracts.forEach(contract=>{

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
   Local Storage
=========================================== */

function loadContracts(){

    const saved = localStorage.getItem("contracts");

    if(saved){

        contracts = JSON.parse(saved);

    }

}

function saveContracts(){

    localStorage.setItem(
        "contracts",
        JSON.stringify(contracts)
    );

}

/* ===========================================
   Contract toevoegen
=========================================== */

function addContract(contract){

    contracts.push(contract);

    saveContracts();

    updateDashboard();

}

/* ===========================================
   Contract verwijderen
=========================================== */

function deleteContract(id){

    contracts = contracts.filter(c => c.id !== id);

    saveContracts();

    updateDashboard();

}

/* ===========================================
   Service Worker
=========================================== */

function registerServiceWorker(){

    if("serviceWorker" in navigator){

        navigator.serviceWorker
            .register("sw.js")
            .then(()=>{

                console.log("Service Worker actief");

            });

    }

}
