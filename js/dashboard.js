/* ==========================================================
   ContractKeeper
   dashboard.js
========================================================== */

let categoryChart = null;

let currentSmartTip = 0;

let touchStartX = 0;

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

    const category =
        categories[context.dataIndex];

    return [

        ContractService.formatPrice(context.raw),

        `${category.percentage.toFixed(1)}%`

    ];

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

    container.ontouchstart = function(event) {

        touchStartX = event.changedTouches[0].clientX;

    };

    container.ontouchend = function(event) {

        const touchEndX =
            event.changedTouches[0].clientX;

        if (touchStartX - touchEndX > 50) {

            nextSmartTip();

        }

        else if (touchEndX - touchStartX > 50) {

            previousSmartTip();

        }

    };

    const insights =
        ContractService.getCKInsights();

    const counter =
        document.getElementById("smartTipCounter");

    if (!insights.length) {

        container.innerHTML = `
            <strong>Geen inzichten beschikbaar</strong>
            <p>Voeg meer contracten toe om CK AI inzichten te ontvangen.</p>
        `;

        if (counter) {

            counter.textContent = "";

        }

        return;

    }

    const insight =
        insights[currentSmartTip];

    container.innerHTML = `

        <strong>${insight.icon} ${insight.title}</strong>

        <p>${insight.message}</p>

    `;

    if (counter && insights.length > 1) {

        counter.textContent =
            `${currentSmartTip + 1} / ${insights.length}`;

    }

}

/* ==========================================================
   VOLGENDE INSIGHT
========================================================== */

function nextSmartTip() {

    const insights =
        ContractService.getCKInsights();

    if (insights.length <= 1) return;

    currentSmartTip++;

    if (currentSmartTip >= insights.length) {

        currentSmartTip = 0;

    }

    updateSmartTip();

}

/* ==========================================================
   VORIGE INSIGHT
========================================================== */

function previousSmartTip() {

    const insights =
        ContractService.getCKInsights();

    if (insights.length <= 1) return;

    currentSmartTip--;

    if (currentSmartTip < 0) {

        currentSmartTip = insights.length - 1;

    }

    updateSmartTip();

}

/* ==========================================================
   OPEN CONTRACTEN
========================================================== */

function openContracts(filter = null) {

    document.getElementById("nav-contracts").click();

    renderContracts(filter);

}

/* ==========================================================
   OPEN ACTIEVE CONTRACTEN
========================================================== */

function openActiveContracts() {

    openContracts("active");

}

/* ==========================================================
   OPEN AANDACHT
========================================================== */

function openAttentionContracts() {

    openContracts("attention");

}

/* ==========================================================
   OPEN BINNENKORT OPZEGBAAR
========================================================== */

function openEndingSoonContracts() {

    openContracts("attention");

}

/* ==========================================================
   CK AI - STATUS
========================================================== */

let ckaiCurrentContract = null;

let ckaiQuestions = [];

let ckaiCurrentQuestion = 0;

let ckaiAnswers = {};

let ckaiSelectedAnswer = null;

/* ==========================================================
   OPEN CK AI
========================================================== */

function openCKAI() {

    hideAllPages();

    const page = document.getElementById("page-ckai");

    if (!page) return;

    page.classList.remove("hidden");

    page.style.display = "block";

    // Navigatie resetten
    document
        .querySelectorAll(".bottom-nav button")
        .forEach(button => {
            button.classList.remove("active");
        });

    document
        .getElementById("nav-ckai")
        ?.classList.add("active");

    document.getElementById("startCKAI").onclick = startCKAI;

}

/* ==========================================================
   START CK AI
========================================================== */

function startCKAI() {

    const container = document.getElementById("ckaiContent");

    if (!container) return;

    const contracts = ContractService.getAll();

    let buttons = "";

    contracts.forEach(contract => {

    const logo = ContractService.getLogo(contract.name);

   buttons += `

<div
    class="ckai-contract-card"
    onclick="selectCKAIContract('${contract.id}')">

    <div class="ckai-contract-left">

        ${
            logo
                ? `<img src="assets/logos/${logo}" class="contract-logo" alt="${contract.name}">`
                : `<i class="bi ${ContractService.getCategoryIcon(contract.category)}"></i>`
        }

        <div class="ckai-contract-content">

            <div class="ckai-contract-title">

                ${contract.name}

            </div>

            <div class="ckai-contract-category">

                ${contract.category}

            </div>

        </div>

    </div>

    <i class="bi bi-chevron-right ckai-contract-chevron"></i>

</div>

`;

});

    container.innerHTML = `

<div class="ckai-contract-selector">

    <div class="ckai-selector-header">

        <h2 class="ckai-selector-title">
            Waar wil je advies over?
        </h2>

        <p class="ckai-selector-subtitle">
            Kies een contract en ContractKeeper AI analyseert het voor jou.
        </p>

    </div>

    <div class="ckai-contract-list">

        ${buttons}

    </div>

</div>

`;

}

/* ==========================================================
   CK AI CONTRACT GEKOZEN
========================================================== */

function selectCKAIContract(contractId) {

    const contract = ContractService.getAll().find(
        c => c.id === contractId
    );

    if (!contract) return;

    const questions =
        CKAI_QUESTIONS[contract.name.toLowerCase()];

    if (!questions || !questions.length) {

        alert("Voor dit contract zijn nog geen vragen beschikbaar.");

        return;

    }

    ckaiCurrentContract = contract;

ckaiQuestions = questions;

ckaiCurrentQuestion = 0;

ckaiAnswers = {};

ckaiSelectedAnswer = null;

showCKAIQuestion(
    ckaiCurrentContract,
    ckaiQuestions,
    ckaiCurrentQuestion
);

}

/* ==========================================================
   CK AI - TOON VRAAG
========================================================== */

function showCKAIQuestion(contract, questions, index) {

    const question = questions[index];

    // Hero verbergen
    document.querySelector(".ckai-card").style.display = "none";

    // Vraagenscherm tonen
    const questionScreen =
        document.getElementById("ckaiQuestionScreen");

    questionScreen.classList.remove("hidden");
    questionScreen.classList.add("active");

    // Contractnaam
    document.getElementById("ckaiQuestionContract").textContent =
        contract.name;

    // Progressie
    document.getElementById("ckaiProgressBar").style.width =
        `${((index + 1) / questions.length) * 100}%`;

    // Volgende knop resetten
    const nextButton =
        document.getElementById("ckaiNextButton");

    nextButton.disabled = true;
    nextButton.classList.remove("active");

    ckaiSelectedAnswer = null;

    // Vraag tonen
    document.getElementById("ckaiQuestionContent").innerHTML = `

        <div class="ckai-question-card">

            <div class="ckai-question-counter">

                Vraag ${index + 1} van ${questions.length}

            </div>

            <h2 class="ckai-question-title">

                ${question.question}

            </h2>

            <div class="ckai-question-options">

                ${question.options.map(option => `

                    <button class="ckai-option-btn">

                        <div class="ckai-option-radio"></div>

                        <span class="ckai-option-text">

                            ${option}

                        </span>

                    </button>

                `).join("")}

            </div>

        </div>

    `;

    // Antwoord selecteren
    document
        .querySelectorAll(".ckai-option-btn")
        .forEach((button, buttonIndex) => {

            button.addEventListener("click", () => {

                document
                    .querySelectorAll(".ckai-option-btn")
                    .forEach(btn => btn.classList.remove("selected"));

                button.classList.add("selected");

                // Gekozen antwoord opslaan
                const selectedOption =
                    question.options[buttonIndex];

                ckaiSelectedAnswer = selectedOption;

                ckaiAnswers[question.id] = selectedOption;

                nextButton.disabled = false;
                nextButton.classList.add("active");

            });

        });

    // Volgende knop
    nextButton.onclick = nextCKAIQuestion;

    // Terug knop
const backButton =
    document.getElementById("ckaiBackButton");

if (backButton) {

    backButton.onclick = () => {

        document
            .getElementById("ckaiQuestionScreen")
            .classList.add("hidden");

        document
            .querySelector(".ckai-card")
            .style.display = "block";

        ckaiCurrentQuestion = 0;
        ckaiSelectedAnswer = null;

    };

}

}

/* ==========================================================
   CK AI - VOLGENDE VRAAG
========================================================== */

function nextCKAIQuestion() {

    // Geen antwoord gekozen?
    if (!ckaiSelectedAnswer) {

        return;

    }

    // Volgende vraag
    ckaiCurrentQuestion++;

    // Alle vragen beantwoord?
    if (ckaiCurrentQuestion >= ckaiQuestions.length) {

    // Vraagenscherm verbergen
    document
        .getElementById("ckaiQuestionScreen")
        .classList.add("hidden");

   // Analyse tonen
document
    .getElementById("ckaiAnalysisScreen")
    .classList.remove("hidden");

// Titel aanpassen
document.getElementById("ckaiAnalysisTitle").textContent =
    `Ik analyseer jouw ${ckaiCurrentContract.name}-abonnement`;

// Analyse starten
startCKAIAnalysis();

    return;

}

    // Volgende vraag tonen
    showCKAIQuestion(
        ckaiCurrentContract,
        ckaiQuestions,
        ckaiCurrentQuestion
    );

}

/* ==========================================================
   CK AI - ANALYSE
========================================================== */

function startCKAIAnalysis() {

    const steps = [

        "Contractgegevens ophalen",
        "Gebruik analyseren",
        "Vergelijken met actuele marktprijzen",
        "Mogelijke besparing berekenen",
        "Persoonlijk advies opstellen"

    ];

    let currentStep = 0;

    function nextStep() {

        if (currentStep > 0) {

    const previousStep =
        document.getElementById(`analysisStep${currentStep}`);

    previousStep.innerHTML =
        `<span class="analysis-success">✓</span> ${steps[currentStep - 1]}`;

}

        if (currentStep < steps.length) {

            const activeStep =
    document.getElementById(`analysisStep${currentStep + 1}`);

activeStep.innerHTML =
    `<span class="analysis-loading">⏳</span> ${steps[currentStep]}`;

            currentStep++;

            setTimeout(nextStep, 1200);

        } else {

    // Analyse verbergen
    document
        .getElementById("ckaiAnalysisScreen")
        .classList.add("hidden");

    // Resultaat tonen
    document
        .getElementById("ckaiResultScreen")
        .classList.remove("hidden");

}

    }

    nextStep();

}

/* ==========================================================
   CK AI - RESULTAAT
========================================================== */

function initCKAIResult() {

    const button =
        document.getElementById("ckaiViewResult");

    if (!button) return;

    button.addEventListener("click", () => {

        // Resultaat verbergen
        document
            .getElementById("ckaiResultScreen")
            .classList.add("hidden");

        // Premium tonen
        document
            .getElementById("ckaiPremiumScreen")
            .classList.remove("hidden");

    });

}

