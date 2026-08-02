/* ==========================================================
   ContractKeeper
   dashboard.js
========================================================== */

function updateDashboard() {

    updateMonthlyTotal();
    updateActiveContracts();
    updateEndingSoon();
    updateYearlyTotal();
    updateAttentionCard();
    updateNextEnding();

}


/* ==========================================================
   MAANDELIJKSE KOST
========================================================== */

function updateMonthlyTotal() {

    const total =
        ContractService.getMonthlyTotal();

    const home =
        document.getElementById("monthlyTotal");

    const insights =
        document.getElementById("monthlyTotalInsights");

    if (home) {

        home.textContent =
            ContractService.formatPrice(total);

    }

    if (insights) {

        insights.textContent =
            ContractService.formatPrice(total);

    }

}


/* ==========================================================
   JAARBEDRAG
========================================================== */

function updateYearlyTotal() {

    const element =
        document.getElementById("yearlyTotal");

    if (!element) return;

    const yearly =
        ContractService.getMonthlyTotal() * 12;

    element.textContent =
        ContractService.formatPrice(yearly);

}


/* ==========================================================
   ACTIEVE CONTRACTEN
========================================================== */

function updateActiveContracts() {

    const total =
        ContractService.getActiveCount();

    const home =
        document.getElementById("activeContracts");

    const insights =
        document.getElementById("activeContractsInsights");

    if (home) {

        home.textContent = total;

    }

    if (insights) {

        insights.textContent = total;

    }

}


/* ==========================================================
   LOOPT BINNENKORT AF
========================================================== */

function updateEndingSoon() {

    const element =
        document.getElementById("endingSoon");

    if (!element) {

        return;

    }

    element.textContent =
        ContractService.getEndingSoonCount();

}

/* ==========================================================
   EERSTVOLGENDE EINDDATUM
========================================================== */

function updateNextEnding() {

    const value =
        document.getElementById("nextEnding");

    const subtitle =
        document.getElementById("nextEndingDate");

    if (!value || !subtitle) return;

    const contract =
        ContractService.getNextEndingContract();

    if (!contract) {

        value.textContent = "-";
        subtitle.textContent = "Geen einddatum gevonden";

        return;

    }

    value.textContent =
        ContractService.formatDate(contract.endDate);

    subtitle.textContent =
        contract.name;

}

/* ==========================================================
   AANDACHTSKAART
========================================================== */

function updateAttentionCard() {

    const card =
        document.getElementById("attentionInfoCard");

    const container =
        document.getElementById("attentionCard");

    if (!card || !container) return;

    const endingSoon =
        ContractService.getEndingSoonCount();

    if (endingSoon === 0) {

        card.className = "info-card success";

        container.innerHTML = `
            <strong>Alles in orde</strong>
            <p>Geen contracten die binnenkort aflopen.</p>
        `;

    }

    else if (endingSoon === 1) {

        card.className = "info-card warning";

        container.innerHTML = `
            <strong>Opgelet</strong>
            <p>1 contract loopt binnenkort af.</p>
        `;

    }

    else {

        card.className = "info-card danger";

        container.innerHTML = `
            <strong>Actie vereist</strong>
            <p>${endingSoon} contracten lopen binnenkort af.</p>
        `;

    }

}


/* ==========================================================
   DASHBOARD VERVERSEN
========================================================== */

function refreshDashboard() {

    updateDashboard();

}
