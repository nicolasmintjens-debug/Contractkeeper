console.log("contracts.js geladen");

/* ===========================================
   ContractKeeper
   contracts.js
=========================================== */

function renderContracts() {

    const container = document.getElementById("contracts");

    if (!container) return;

const contracts = getContracts();

console.log("Contracten:", contracts);

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

                    <p>${contract.supplier}</p>

                </div>

                <div class="price">

                    €${contract.amount.toFixed(2).replace(".", ",")}

                </div>

            </div>

        `;

    });

}

/* ===========================================
   Contract toevoegen
=========================================== */

function addContract(contract) {

    const contracts = getContracts();

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
