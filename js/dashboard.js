/* ===========================================
   ContractKeeper
   dashboard.js
=========================================== */

/**
 * Dashboard volledig vernieuwen
 */
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

        const amount = Number(contract.amount) || 0;

        switch (contract.frequency) {

            case "yearly":
                total += amount / 12;
                break;

            case "monthly":
            default:
                total += amount;
                break;

        }

    });

    const element = document.querySelector(".stats .card h1");

    if (!element) return;

    element.textContent = "€" + total.toFixed(2).replace(".", ",");

}

/* ===========================================
   Statistieken
=========================================== */

function updateStatistics() {

    const contracts = getContracts();

    const cards = document.querySelectorAll(".mini-card h2");

    if (cards.length < 2) return;

    // Actieve contracten
    cards[0].textContent = contracts.length;

    // Binnen 30 dagen
    cards[1].textContent = getEndingSoonCount();

}

/* ===========================================
   Binnen 30 dagen
=========================================== */

function getEndingSoonCount() {

    const today = new Date();

    let count = 0;

    getContracts().forEach(contract => {

        if (!contract.endDate) return;

        const endDate = new Date(contract.endDate);

        const days =
            (endDate - today) / (1000 * 60 * 60 * 24);

        if (days >= 0 && days <= 30) {

            count++;

        }

    });

    return count;

}
