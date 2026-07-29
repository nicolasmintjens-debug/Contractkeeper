/* ===========================================
   ContractKeeper
   dashboard.js
=========================================== */

function updateDashboard() {

    updateMonthlyCosts();

    updateStatistics();

}

/* ===========================================
   Maandelijkse kosten
=========================================== */

function updateMonthlyCosts() {

    const contracts = getContracts();

    let total = 0;

    contracts.forEach(contract => {

        if (contract.frequency === "yearly") {

            total += contract.amount / 12;

        } else {

            total += contract.amount;

        }

    });

    const element = document.querySelector(".card h1");

    if (element) {

        element.textContent =
            "€" + total.toFixed(2).replace(".", ",");

    }

}

/* ===========================================
   Statistieken
=========================================== */

function updateStatistics() {

    const cards = document.querySelectorAll(".mini-card h2");

    if (cards.length < 2) return;

    const contracts = getContracts();

    cards[0].textContent = contracts.length;

    cards[1].textContent = contractsEndingSoon();

}

/* ===========================================
   Contracten die binnenkort aflopen
=========================================== */

function contractsEndingSoon() {

    const today = new Date();

    let count = 0;

    getContracts().forEach(contract => {

        if (!contract.endDate) return;

        const end = new Date(contract.endDate);

        const diff =
            (end - today) / (1000 * 60 * 60 * 24);

        if (diff >= 0 && diff <= 30) {

            count++;

        }

    });

    return count;

}
