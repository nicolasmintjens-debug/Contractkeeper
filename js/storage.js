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

        try {

            contracts = JSON.parse(savedContracts);

            // Zorg dat alle verplichte velden bestaan
            contracts = contracts.map(contract => ({

                id: contract.id ?? Date.now() + Math.random(),

                name: contract.name ?? "Onbekend contract",

                supplier: contract.supplier ?? contract.name ?? "",

                category: contract.category ?? "Overig",

                amount: Number(contract.amount) || 0,

                frequency: contract.frequency ?? "monthly",

                endDate: contract.endDate ?? "",

                notes: contract.notes ?? ""

            }));

            saveContracts();

            return;

        } catch (error) {

            console.error("Fout bij laden van contracten:", error);

            localStorage.removeItem("contracts");

        }

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

/* ===========================================
   Alle contracten verwijderen
   (handig tijdens ontwikkeling)
=========================================== */

function resetContracts() {

    localStorage.removeItem("contracts");

    loadContracts();

    renderContracts();

    updateDashboard();

    console.log("Contracten opnieuw geladen.");

}
