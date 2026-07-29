console.log("storage.js geladen");

/* ===========================================
   ContractKeeper
   storage.js
=========================================== */

let contracts = [];

/* ===========================================
   Contracten laden
=========================================== */

function loadContracts() {

    const savedContracts = localStorage.getItem("contracts");

    if (savedContracts) {

        contracts = JSON.parse(savedContracts);

        return;

    }

    // Voorbeeldgegevens bij eerste opstart

    contracts = [

        {
            id: 1,
            name: "Netflix",
            supplier: "Netflix",
            category: "Streaming",
            amount: 14.99,
            frequency: "monthly",
            endDate: "2027-01-01",
            notes: ""
        },

        {
            id: 2,
            name: "Internet thuis",
            supplier: "Proximus",
            category: "Internet",
            amount: 69.99,
            frequency: "monthly",
            endDate: "2026-12-31",
            notes: ""
        }

    ];

    saveContracts();

}

/* ===========================================
   Contracten opslaan
=========================================== */

function saveContracts() {

    localStorage.setItem(
        "contracts",
        JSON.stringify(contracts)
    );

}

/* ===========================================
   Alle contracten ophalen
=========================================== */

function getContracts() {

    return contracts;

}
