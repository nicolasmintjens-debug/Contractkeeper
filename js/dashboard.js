/* ==========================================================
   ContractKeeper
   dashboard.js
========================================================== */

let categoryChart = null;

let currentSmartTip = 0;

function updateDashboard() {

    updateMonthlyTotal();
    updateActiveContracts();
    updateEndingSoon();
    updateYearlyTotal();
    updateAttentionCard();
    updateNextEnding();
    updateMostExpensiveContract();
    updateCategoryTotals();
    updateCategoryChart();
    updateSmartTip();

}

/* ==========================================================
   UITGAVEN PER CATEGORIE
========================================================== */

function updateCategoryTotals() {

    const container =
        document.getElementById("categoryTotals");

    if (!container) return;

    const categories =
        ContractService.getCategoryTotals();

    if (!categories.length) {

        container.innerHTML =
            "<p>Geen categorieën gevonden.</p>";

        return;

    }

container.innerHTML = categories.map(category => `

    <div class="category-row">

        <div class="category-info">

            <span class="category-name">
                ${category.category}
            </span>

            <span class="category-percentage">
                ${category.percentage.toFixed(1)}%
            </span>

        </div>

        <span class="category-price">
            ${ContractService.formatPrice(category.total)}
        </span>

    </div>

`).join("");
   
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
   DUURSTE CONTRACT
========================================================== */

function updateMostExpensiveContract() {

    const value =
        document.getElementById("highestContract");

    const subtitle =
        document.getElementById("highestContractPrice");

    if (!value || !subtitle) return;

    const contract =
        ContractService.getMostExpensiveContract();

    if (!contract) {

        value.textContent = "-";
        subtitle.textContent = "Geen contracten";

        return;

    }

    value.textContent =
        contract.name;

    subtitle.textContent =
        ContractService.formatPrice(contract.amount);

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

/* ==========================================================
   DONUTGRAFIEK
========================================================== */

function updateCategoryChart() {

    const container =
        document.getElementById("categoryChart");

    if (!container) return;

    const categories =
        ContractService.getCategoryTotals();

    if (!categories.length) {

        container.innerHTML = "";

        return;

    }

    container.innerHTML =
        "<canvas id='categoryChartCanvas'></canvas>";

    const canvas =
        document.getElementById("categoryChartCanvas");

    if (categoryChart) {

        categoryChart.destroy();

    }

    categoryChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: categories.map(c => c.category),

            datasets: [{

                data: categories.map(c => c.total),

                backgroundColor: [

                    "#34D399",
                    "#3B82F6",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                    "#14B8A6",
                    "#F97316",
                    "#EC4899"

                ],

                borderWidth: 0

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "70%",

            plugins: {

    legend: {

        display: false

    },

    tooltip: {

        callbacks: {

            label: function(context) {

                return ContractService.formatPrice(context.raw);

            }

        }

    }

}
        }

    });

}

/* ==========================================================
   SLIMME TIP
========================================================== */

function updateSmartTip() {

    const container =
        document.getElementById("smartTipCard");

    if (!container) return;

    const tips =
        ContractService.getSmartTips();

const counter =
    document.getElementById("smartTipCounter");
   
    if (!tips.length) {

        container.innerHTML = `
            <strong>Geen tips beschikbaar</strong>
            <p>Voeg meer contracten toe om slimme tips te ontvangen.</p>
        `;
       
if (counter) {

    counter.textContent = "";

}
        return;

    }

    const tip = tips[currentSmartTip];

    container.innerHTML = `

        <strong>${tip.icon} ${tip.title}</strong>

        <p>${tip.message}</p>

    `;

if (counter && tips.length > 1) {

    counter.textContent =
        `${currentSmartTip + 1} / ${tips.length}`;

}
   
}

/* ==========================================================
   VOLGENDE SLIMME TIP
========================================================== */

function nextSmartTip() {

    const tips =
        ContractService.getSmartTips();

    if (tips.length <= 1) return;

    currentSmartTip++;

    if (currentSmartTip >= tips.length) {

        currentSmartTip = 0;

    }

    updateSmartTip();

}

/* ==========================================================
   VORIGE SLIMME TIP
========================================================== */

function previousSmartTip() {

    const tips =
        ContractService.getSmartTips();

    if (tips.length <= 1) return;

    currentSmartTip--;

    if (currentSmartTip < 0) {

        currentSmartTip = tips.length - 1;

    }

    updateSmartTip();

}
