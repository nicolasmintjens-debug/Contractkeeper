/* ==========================================================
   ContractKeeper
   contracts.js
========================================================== */

let currentContracts = [];
let currentCategory = "all";
let currentSearch = "";
let currentSort = "name-asc";


/* ==========================================================
   INITIALISATIE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initContractEvents();

});


function initContractEvents() {

    const search = document.getElementById("searchContracts");

    if (search) {

        search.addEventListener("input", e => {

            currentSearch = e.target.value;

            renderContracts();

        });

    }

    document.querySelectorAll(".category-chip").forEach(chip => {

        chip.addEventListener("click", () => {

            document.querySelectorAll(".category-chip")
                .forEach(c => c.classList.remove("active"));

            chip.classList.add("active");

            currentCategory = chip.dataset.category || "all";

            renderContracts();

        });

    });

}


/* ==========================================================
   CONTRACTEN OPHALEN
========================================================== */

function getFilteredContracts() {

    let contracts = ContractService.getAll();

    if (currentCategory !== "all") {

        contracts = contracts.filter(

            c => c.category === currentCategory

        );

    }

    if (currentSearch.trim() !== "") {

    const value = currentSearch.toLowerCase();

    contracts = contracts.filter(contract =>

        contract.name.toLowerCase().includes(value) ||

        contract.supplier.toLowerCase().includes(value) ||

        contract.category.toLowerCase().includes(value)

    );

}

/* Sorteren */
contracts.sort((a, b) => {

    switch (currentSort) {

        case "name-asc":
            return a.name.localeCompare(b.name);

        default:
            return 0;

    }

});

return contracts;
}


/* ==========================================================
   RENDER
========================================================== */

function renderContracts() {

    const container = document.getElementById("contracts");

    const empty = document.getElementById("emptyContracts");

    if (!container) {

        return;

    }

    currentContracts = getFilteredContracts();

    container.innerHTML = "";

    if (currentContracts.length === 0) {

        if (empty) {

            empty.hidden = false;

        }

        return;

    }

    if (empty) {

        empty.hidden = true;

    }

    currentContracts.forEach(contract => {

        container.appendChild(

            createContractCard(contract)

        );

    });

}


/* ==========================================================
   CARD
========================================================== */

function createContractCard(contract) {

    const card = document.createElement("div");

    card.className = "contract-card";

    const status = ContractService.getStatus(contract);

    const icon = ContractService.getCategoryIcon(contract.category);

    card.innerHTML = `

    <div class="contract-top">

        <div class="contract-name">

            <i class="bi ${icon}"></i>

            <span>${escapeHtml(contract.name)}</span>

        </div>

        <div class="contract-price">

            ${ContractService.formatPrice(contract.amount)}

        </div>

    </div>

    <div class="contract-period">

        ${translateFrequency(contract.frequency)}

    </div>

    <div class="contract-bottom">

        ${escapeHtml(contract.category)} • Eindigt ${ContractService.formatDate(contract.endDate)}

    </div>

`;

    card.addEventListener("click", () => {

    showDetailModal(contract);

});

    return card;

}


/* ==========================================================
   VERWIJDEREN
========================================================== */

function deleteContract(id) {

    if (!confirm("Dit contract verwijderen?")) {

        return;

    }

    ContractService.delete(id);

    renderContracts();

    if (typeof updateDashboard === "function") {

        updateDashboard();

    }

}


/* ==========================================================
   BEWERKEN
========================================================== */

function editContract(id) {

    if (typeof openEditModal === "function") {

        openEditModal(id);

    }

}


/* ==========================================================
   HULPFUNCTIES
========================================================== */

function translateFrequency(frequency) {

    switch (frequency) {

        case "monthly":
            return "Maandelijks";

        case "quarterly":
            return "Per kwartaal";

        case "yearly":
            return "Jaarlijks";

        default:
            return frequency;

    }

}


function translateStatus(status) {

    switch (status) {

        case "active":
            return "Actief";

        case "ending":
            return "Loopt af";

        case "expired":
            return "Verlopen";

        default:
            return status;

    }

}


function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
