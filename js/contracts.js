console.log("contracts.js geladen");

/* ===========================================
   ContractKeeper
   contracts.js
=========================================== */

/* ===========================================
   Contracten weergeven
=========================================== */

function renderContracts() {

    const container = document.getElementById("contracts");

    if (!container) return;

    const contracts = getContracts();

    console.log("Contracten:", contracts);

    container.innerHTML = "";

    if (!contracts || contracts.length === 0) {

        container.innerHTML = `
            <div class="empty-card">
                Nog geen contracten toegevoegd.
            </div>
        `;

        return;
    }

    contracts.forEach(contract => {

        console.log("Contract:", contract);

        const name = contract.name || "Onbekend contract";
        const supplier = contract.supplier || "-";
        const category = contract.category || "-";
        const amount = Number(contract.amount) || 0;
        const endDate = contract.endDate || "-";

        container.innerHTML += `
            <div class="contract-card">

                <div class="contract-info">
                    <h4>${name}</h4>
                    <p>${supplier}</p>
                    <small>${category}</small>
                </div>

                <div class="contract-price">
                    €${amount.toFixed(2).replace(".", ",")}
                </div>

            </div>
        `;

    });

}

/* ===========================================
   Contract toevoegen
=========================================== */

function addContract(contract) {

    contracts.push(contract);

    saveContracts();

    renderContracts();

    updateDashboard();

}

/* ===========================================
   Contract verwijderen
=========================================== */

function deleteContract(id) {

    contracts = contracts.filter(contract => contract.id !== id);

    saveContracts();

    renderContracts();

    updateDashboard();

}
