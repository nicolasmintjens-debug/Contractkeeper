/* ==========================================================
   ContractKeeper
   dashboard.js
========================================================== */

let categoryChart = null;

let currentSmartTip = 0;

let touchStartX = 0;

let currentCKAIHomeInsight = 0;

/* ==========================================================
   WIST JE DAT - TIPS
========================================================== */

const didYouKnowTips = [

    "Veel mensen betalen nog maanden voor abonnementen die ze nauwelijks gebruiken.",

    "Een paar euro besparen per maand kan op jaarbasis een verrassend groot verschil maken.",

    "Veel abonnementen worden automatisch verlengd zonder dat je er nog bewust bij stilstaat.",

    "Door je contracten regelmatig te controleren voorkom je dat kleine prijsstijgingen ongemerkt oplopen.",

    "Streamingdiensten zijn vaak één van de eerste plekken waar ongebruikte abonnementen blijven doorlopen.",

    "Een contract dat ooit voordelig was, is niet automatisch vandaag nog de beste keuze.",

    "Jaarlijks je vaste contracten controleren kan helpen om onnodige kosten sneller te ontdekken.",

    "ContractKeeper helpt je al je abonnementen en contracten op één plaats overzichtelijk te houden."

];

let currentDidYouKnowTip = 0;

function updateDidYouKnow() {

    const card =
    document.querySelector(".did-you-know-card");

if (card) {

    card.ontouchstart = function(event) {
        touchStartX = event.changedTouches[0].clientX;
    };

    card.ontouchend = function(event) {

        const touchEndX =
            event.changedTouches[0].clientX;

        if (touchStartX - touchEndX > 50) {

            nextDidYouKnowTip();

        } else if (touchEndX - touchStartX > 50) {

            previousDidYouKnowTip();

        }

    };

}

    const text =
        document.getElementById("didYouKnowText");

    const counter =
        document.getElementById("didYouKnowCounter");

    if (!text || !counter) return;

    text.textContent =
        didYouKnowTips[currentDidYouKnowTip];

    counter.textContent =
        `${currentDidYouKnowTip + 1} / ${didYouKnowTips.length}`;
}

function nextDidYouKnowTip() {

    const card =
        document.querySelector(".did-you-know-card");

    if (!card) return;

    card.classList.add("swipe-left");

    setTimeout(() => {

        currentDidYouKnowTip++;

        if (currentDidYouKnowTip >= didYouKnowTips.length) {
            currentDidYouKnowTip = 0;
        }

        card.style.transition = "none";

        card.classList.remove("swipe-left");

        card.style.transform = "translateX(110%)";
        card.style.opacity = "0";

        updateDidYouKnow();

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                card.style.transition =
                    "transform .22s ease, opacity .22s ease";

                card.style.transform = "translateX(0)";
                card.style.opacity = "1";

            });

        });

    }, 220);

}


function previousDidYouKnowTip() {

    const card =
        document.querySelector(".did-you-know-card");

    if (!card) return;

    card.classList.add("swipe-right");

    setTimeout(() => {

        currentDidYouKnowTip--;

        if (currentDidYouKnowTip < 0) {
            currentDidYouKnowTip = didYouKnowTips.length - 1;
        }

        card.style.transition = "none";

        card.classList.remove("swipe-right");

        card.style.transform = "translateX(-110%)";
        card.style.opacity = "0";

        updateDidYouKnow();

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                card.style.transition =
                    "transform .22s ease, opacity .22s ease";

                card.style.transform = "translateX(0)";
                card.style.opacity = "1";

            });

        });

    }, 220);

}

function updateCKAIHome() {

    const card =
    document.querySelector(".ck-ai-home-card");

if (card) {

    card.ontouchstart = function(event) {
        touchStartX = event.changedTouches[0].clientX;
    };

    card.ontouchend = function(event) {

        const touchEndX =
            event.changedTouches[0].clientX;

        if (touchStartX - touchEndX > 50) {

            nextCKAIHomeInsight();

        } else if (touchEndX - touchStartX > 50) {

            previousCKAIHomeInsight();

        }

    };

}

    const insights =
        ContractService.getCKInsights();

    const counter =
        document.getElementById("ckAiHomeCounter");

    const status =
        document.querySelector(".ck-ai-home-status");

    const text =
        document.getElementById("ckAiHomeText");

    if (!counter || !status || !text) return;

    if (!insights.length) {

        counter.textContent = "";
        status.textContent = "✅ Alles in orde";
        text.textContent =
            "Er zijn momenteel geen nieuwe CK AI-signalen.";

        return;
    }

    if (currentCKAIHomeInsight >= insights.length) {
        currentCKAIHomeInsight = 0;
    }

    const insight =
        insights[currentCKAIHomeInsight];

    counter.textContent =
        `${currentCKAIHomeInsight + 1} / ${insights.length}`;

    status.textContent =
        `${insight.icon} ${insight.title}`;

        status.className =
    `ck-ai-home-status ${insight.type}`;

    text.textContent =
        insight.message;
}

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
    updateDidYouKnow();
    updateCKAIHome();
    renderSmartInsights();

}

async function nextCKAIHomeInsight() {

    const insights =
        ContractService.getCKInsights();

    if (insights.length <= 1) return;

    const card =
        document.querySelector(".ck-ai-home-card");

    if (!card) return;


    // Oude kaart naar links
    await card.animate(
        [
            {
                transform: "translateX(0)",
                opacity: 1
            },
            {
                transform: "translateX(-110%)",
                opacity: 0
            }
        ],
        {
            duration: 220,
            easing: "ease",
            fill: "forwards"
        }
    ).finished;


    // Volgend inzicht
    currentCKAIHomeInsight++;

    if (currentCKAIHomeInsight >= insights.length) {
        currentCKAIHomeInsight = 0;
    }

    updateCKAIHome();


    // Nieuwe kaart van rechts binnen
    await card.animate(
        [
            {
                transform: "translateX(110%)",
                opacity: 0
            },
            {
                transform: "translateX(0)",
                opacity: 1
            }
        ],
        {
            duration: 220,
            easing: "ease",
            fill: "forwards"
        }
    ).finished;

}

async function previousCKAIHomeInsight() {

    const insights =
        ContractService.getCKInsights();

    if (insights.length <= 1) return;

    const card =
        document.querySelector(".ck-ai-home-card");

    if (!card) return;


    // Oude kaart naar rechts
    await card.animate(
        [
            {
                transform: "translateX(0)",
                opacity: 1
            },
            {
                transform: "translateX(110%)",
                opacity: 0
            }
        ],
        {
            duration: 220,
            easing: "ease",
            fill: "forwards"
        }
    ).finished;


    // Vorig inzicht
    currentCKAIHomeInsight--;

    if (currentCKAIHomeInsight < 0) {
        currentCKAIHomeInsight =
            insights.length - 1;
    }

    updateCKAIHome();


    // Nieuwe kaart van links binnen
    await card.animate(
        [
            {
                transform: "translateX(-110%)",
                opacity: 0
            },
            {
                transform: "translateX(0)",
                opacity: 1
            }
        ],
        {
            duration: 220,
            easing: "ease",
            fill: "forwards"
        }
    ).finished;

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

    const status =
        document.getElementById("endingSoonStatus");

    if (!element) return;

    const endingSoon =
        ContractService.getEndingSoonCount();

    element.textContent = endingSoon;

    if (!status) return;

    if (endingSoon === 0) {

    status.textContent = "Geen actie nodig";
    status.className = "mini-card-status";

} else if (endingSoon === 1) {

    status.textContent = "1 binnen 30 dagen";
    status.className = "mini-card-status warning";

} else {

    status.textContent = `${endingSoon} binnen 30 dagen`;
    status.className = "mini-card-status danger";

}

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

    const count =
        document.getElementById("attentionCount");

    const status =
        document.getElementById("attentionMiniStatus");

    if (!count || !status) return;

    const endingSoon =
        ContractService.getEndingSoonCount();

    count.textContent = endingSoon;

    if (endingSoon === 0) {

    status.textContent = "Alles in orde";
    status.className = "mini-card-status";

} else if (endingSoon === 1) {

    status.textContent = "Opgelet";
    status.className = "mini-card-status warning";

} else {

    status.textContent = "Actie vereist";
    status.className = "mini-card-status danger";

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

let ckaiEvaluationResult = null;

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


    // ===========================
    // CK AI RESETTEN
    // ===========================

    // Welkomstkaart opnieuw tonen
    const welcomeCard =
        document.querySelector(".ckai-card");

    if (welcomeCard) {
        welcomeCard.style.display = "block";
    }

    // Oude contractkeuze verwijderen
const ckaiContent =
    document.getElementById("ckaiContent");

if (ckaiContent) {
    ckaiContent.innerHTML = "";
}

    // Vraagenscherm verbergen
    document
        .getElementById("ckaiQuestionScreen")
        ?.classList.add("hidden");

    // Analysescherm verbergen
    document
        .getElementById("ckaiAnalysisScreen")
        ?.classList.add("hidden");

    // Resultaatscherm verbergen
    document
        .getElementById("ckaiResultScreen")
        ?.classList.add("hidden");

    // Premiumscherm verbergen
    document
        .getElementById("ckaiPremiumScreen")
        ?.classList.add("hidden");

        // Advies/resultaatscherm verbergen
document
    .getElementById("ckaiAdviceScreen")
    ?.classList.add("hidden");


    // AI status resetten
    ckaiCurrentQuestion = 0;
    ckaiSelectedAnswer = null;
    ckaiAnswers = {};


    // Startknop activeren
    const startButton =
        document.getElementById("startCKAI");

    if (startButton) {
        startButton.onclick = startCKAI;
    }

}

function openCKAIInsights() {

    hideAllPages();

    const page =
        document.getElementById("ckAiInsightsSection");

    if (!page) return;

    page.style.display = "block";

    renderCKAIInsights();

    document
        .querySelectorAll(".bottom-nav button")
        .forEach(button => {
            button.classList.remove("active");
        });

}

function renderCKAIInsights() {

    const container =
        document.getElementById("ckAiInsightsList");

    if (!container) return;

    const insights =
        ContractService.getCKInsights();

    if (!insights.length) {

        container.innerHTML = `
            <div class="ck-ai-insights-empty">
                Geen inzichten beschikbaar.
            </div>
        `;

        return;
    }


    /* ==============================
       INZICHTEN OPSPLITSEN
    ============================== */

    const mainInsights =
        insights.filter(insight =>
            insight.priority <= 3
        );

    const overviewInsights =
        insights.filter(insight =>
            insight.priority >= 4
        );


    /* ==============================
       KAART MAKEN
    ============================== */

    function createInsightCard(insight) {

        return `
            <div class="ck-ai-insight-card ${insight.type} priority-${insight.priority}">

                <div class="ck-ai-insight-header">

                    <span class="ck-ai-insight-icon">
                        ${insight.icon}
                    </span>

                    <span class="ck-ai-insight-title">
                        ${insight.title}
                    </span>

                </div>

                <p class="ck-ai-insight-message">
                    ${insight.message}
                </p>

                ${insight.type === "warning" ? `
    <button
        class="ck-ai-insight-action"
        onclick="openEndingSoonContracts()">

        Bekijk contract →

    </button>
` : ""}

            </div>
        `;
    }


    /* ==============================
       PAGINA OPBOUWEN
    ============================== */

    container.innerHTML = `

        <div class="ck-ai-main-insights">

            ${mainInsights
                .map(createInsightCard)
                .join("")}

        </div>


        <div class="ck-ai-overview">

            <h3 class="ck-ai-overview-title">
                Jouw overzicht
            </h3>

            <div class="ck-ai-overview-grid">

                ${overviewInsights
                    .map(createInsightCard)
                    .join("")}

            </div>

        </div>

    `;

}

function renderSmartInsights() {

    const container =
        document.getElementById("smartInsightsList");

    if (!container) return;

    const insights =
        ContractService.getCKInsights();

    /*
     * Alleen echte inzichten tonen.
     * De algemene statistieken staan al
     * in het financieel overzicht.
     */
    const smartInsights = insights.filter(insight =>
        insight.type === "warning" ||
        insight.type === "reminder" ||
        insight.type === "analysis" ||
        insight.type === "success"
    );

    if (!smartInsights.length) {

        container.innerHTML = `
            <div class="smart-insight-empty">
                Momenteel zijn er geen bijzondere inzichten.
            </div>
        `;

        return;
    }

    container.innerHTML = smartInsights.map(insight => `

        <div class="smart-insight-card ${insight.type} priority-${insight.priority}">

            <div class="smart-insight-icon">
                ${insight.icon}
            </div>

            <div class="smart-insight-content">

                <div class="smart-insight-title">
                    ${insight.title}
                </div>

                <p class="smart-insight-message">
                    ${insight.message}
                </p>

            </div>

        </div>

    `).join("");

}

function renderTips() {

    const container =
        document.getElementById("tipsList");

    if (!container) return;

    const tips = [

        {
            icon: "💶",
            title: "Kleine bedragen tellen op",
            text: "Een abonnement van €9,99 per maand kost je bijna €120 per jaar."
        },

        {
            icon: "🔄",
            title: "Let op automatische verlenging",
            text: "Sommige contracten lopen automatisch verder wanneer je ze niet tijdig opzegt."
        },

        {
            icon: "📺",
            title: "Controleer je abonnementen",
            text: "Streamingdiensten en andere kleine abonnementen worden makkelijk vergeten wanneer je ze weinig gebruikt."
        },

        {
            icon: "📅",
            title: "Hou einddatums in de gaten",
            text: "Door regelmatig je einddatums te controleren, weet je wanneer het tijd is om een contract opnieuw te bekijken."
        },

        {
            icon: "🧾",
            title: "Vergelijk maand- en jaarprijzen",
            text: "Een klein maandelijks verschil kan op jaarbasis een veel groter bedrag betekenen."
        },

        {
            icon: "💡",
            title: "Bekijk regelmatig je vaste kosten",
            text: "Een periodieke controle van je contracten helpt om overzicht te houden over waar je geld naartoe gaat."
        }

    ];

    container.innerHTML = tips.map(tip => `

        <div class="tip-card">

            <div class="tip-card-icon">
                ${tip.icon}
            </div>

            <div class="tip-card-content">

                <div class="tip-card-title">
                    ${tip.title}
                </div>

                <p class="tip-card-text">
                    ${tip.text}
                </p>

            </div>

        </div>

    `).join("");

}

/* ==========================================================
   START CK AI
========================================================== */

function startCKAI() {

    const container = document.getElementById("ckaiContent");

    if (!container) return;

    // Vorige CK AI schermen resetten

document
    .getElementById("ckaiQuestionScreen")
    ?.classList.add("hidden");

document
    .getElementById("ckaiAnalysisScreen")
    ?.classList.add("hidden");

document
    .getElementById("ckaiResultScreen")
    ?.classList.add("hidden");

document
    .getElementById("ckaiPremiumScreen")
    ?.classList.add("hidden");

document
    .getElementById("ckaiAdviceScreen")
    ?.classList.add("hidden");

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
                ? `<img src="${resolveLogoSrc(logo)}" class="contract-logo" alt="${contract.name}">`
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

    const contractKey =
    contract.name.toLowerCase();

const categoryKey =
    contract.category.toLowerCase();

const questions =
    CKAI_QUESTIONS[contractKey] ||
    CKAI_QUESTIONS[categoryKey];

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
const progressSegments =
    document.querySelectorAll(".ckai-progress-segment");

progressSegments.forEach((segment, segmentIndex) => {

    if (segmentIndex <= index) {

        segment.classList.add("active");

    } else {

        segment.classList.remove("active");

    }

});

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
    "Analyse wordt gemaakt";

document.getElementById("ckaiAnalysisContract").textContent =
    ckaiCurrentContract.name;

// CK AI evaluatie uitvoeren
ckaiEvaluationResult = null;

ckaiEvaluationResult =
    evaluateCKAI();

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
CK AI - ANTWOORDCOMBINATIE
========================================================== */

function getCKAIAnswerCombination() {

    return ckaiQuestions.map(question => {

        const selectedAnswer = ckaiAnswers[question.id];

        const answerIndex =
            question.options.indexOf(selectedAnswer);

        if (answerIndex === -1) {
            return "?";
        }

        return ["A", "B", "C", "D"][answerIndex];

    }).join("-");

}

/* ==========================================================
   CK AI - ALGEMENE EVALUATIE
========================================================== */

function evaluateCKAI() {

    let score = 0;

    const contractKey =
        ckaiCurrentContract.name.toLowerCase();

    const categoryKey =
        ckaiCurrentContract.category.toLowerCase();

    const scoring =
        CKAI_SCORING[contractKey] ||
        CKAI_SCORING[categoryKey];

    if (!scoring) {

        return {
            status: "herbekijken",
            title: "Herbekijken",
            score: 0
        };

    }

    const answers =
        Object.values(ckaiAnswers);

    scoring.forEach((questionScoring, index) => {

        if (!questionScoring) {
            return;
        }

        const answer =
            answers[index];

        const answerScore =
            questionScoring[answer];

        if (typeof answerScore === "number") {
            score += answerScore;
        }

    });


    // Eindresultaat bepalen

    if (score >= 7) {

        return {
            status: "behouden",
            title: "Behouden",
            score: score
        };

    }

    if (score >= 3) {

        return {
            status: "optimaliseren",
            title: "Goed, maar optimalisatie mogelijk",
            score: score
        };

    }

    if (score >= -6) {

        return {
            status: "herbekijken",
            title: "Herbekijken",
            score: score
        };

    }

    return {
        status: "opzeggen",
        title: "Opzeggen of alternatief zoeken",
        score: score
    };

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

    const progressBar =
        document.getElementById("ckaiAnalysisProgressBar");

    function nextStep() {

        // Vorige stap afronden
        if (currentStep > 0) {

            const previousStep =
                document.getElementById(
                    `analysisStep${currentStep}`
                );

            previousStep.innerHTML =
                `<span class="analysis-success">✓</span> ${steps[currentStep - 1]}`;

        }

        // Progressiebalk bijwerken
        if (progressBar) {

            progressBar.style.width =
                `${(currentStep / steps.length) * 100}%`;

        }

        // Nog stappen te gaan
        if (currentStep < steps.length) {

            const activeStep =
                document.getElementById(
                    `analysisStep${currentStep + 1}`
                );

            activeStep.innerHTML =
                `<span class="analysis-loading">⏳</span> ${steps[currentStep]}`;

            currentStep++;

            setTimeout(nextStep, 1200);

        } else {

            // Progressie op 100%
            if (progressBar) {
                progressBar.style.width = "100%";
            }

            // Analyse verbergen
document
    .getElementById("ckaiAnalysisScreen")
    .classList.add("hidden");

// Contractnaam tonen in resultaat
const resultContract =
    document.getElementById("ckaiResultContract");

if (resultContract && ckaiCurrentContract) {

    resultContract.textContent =
        `${ckaiCurrentContract.name} is geanalyseerd`;

}

// Evaluatieresultaat tonen
const resultTitle =
    document.getElementById("ckaiResultTitle");

const resultText =
    document.getElementById("ckaiResultText");

if (ckaiEvaluationResult) {

    if (resultTitle) {
        resultTitle.textContent =
            ckaiEvaluationResult.title;
    }

    if (resultText) {

        switch (ckaiEvaluationResult.status) {

            case "behouden":
                resultText.textContent =
                    "Dit abonnement lijkt goed bij jouw gebruik te passen.";
                break;

            case "optimaliseren":
                resultText.textContent =
                    "Dit abonnement past redelijk goed bij jouw gebruik, maar er zijn mogelijk optimalisaties.";
                break;

            case "herbekijken":
                resultText.textContent =
                    "Je haalt momenteel mogelijk niet genoeg waarde uit dit abonnement.";
                break;

            case "opzeggen":
                resultText.textContent =
                    "Op basis van je antwoorden lijkt dit abonnement momenteel weinig waarde te bieden.";
                break;

        }

    }

}

// Resultaat tonen
document
    .getElementById("ckaiResultScreen")
    .classList.remove("hidden");

        }

    }

    nextStep();

}

/* ==========================================================
   CK AI - NATUURLIJKE ANALYSETEKST
========================================================== */

function getCKAIInsight(category, index, answer) {

    const insights = {

        netflix: [
            {
                "Alleen ik": "Je gebruikt Netflix alleen.",
                "2 personen": "Je deelt Netflix met twee personen.",
                "3 personen": "Je deelt Netflix met drie personen.",
                "4 of meer": "Netflix wordt door vier of meer personen gebruikt."
            },
            {
                "Standard met reclame": "Je gebruikt het voordeligere Standard-abonnement met reclame.",
                "Standard": "Je hebt het Standard-abonnement.",
                "Premium": "Je betaalt voor het uitgebreidere Premium-abonnement.",
                "Weet ik niet": "Je weet momenteel niet precies welk Netflix-abonnement je hebt."
            },
            {
                "Ja": "Je maakt gebruik van 4K Ultra HD.",
                "Nee": "4K Ultra HD is voor jou geen belangrijke functie.",
                "Weet ik niet": "Het is niet duidelijk of je 4K Ultra HD gebruikt."
            },
            {
                "Dagelijks": "Je kijkt dagelijks Netflix.",
                "Enkele keren per week": "Je kijkt meerdere keren per week Netflix.",
                "Af en toe": "Je gebruikt Netflix maar af en toe.",
                "Bijna nooit": "Je kijkt bijna nooit Netflix."
            },
            {
                "Zeer tevreden": "Je bent zeer tevreden over je huidige Netflix-abonnement.",
                "Tevreden": "Je bent tevreden over je huidige Netflix-abonnement.",
                "Twijfel": "Je twijfelt of je huidige Netflix-abonnement nog voldoende waarde biedt.",
                "Nee": "Je bent niet tevreden over je huidige Netflix-abonnement."
            }
        ],


        gaming: [
            {
                "Dagelijks": "Je gebruikt dit gamingabonnement dagelijks.",
                "Enkele keren per week": "Je gebruikt dit gamingabonnement meerdere keren per week.",
                "Af en toe": "Je gebruikt dit gamingabonnement maar af en toe.",
                "Bijna nooit": "Je gebruikt dit gamingabonnement bijna nooit."
            },
            {
                "Bijna altijd": "Je speelt voornamelijk games die in het abonnement inbegrepen zijn.",
                "Regelmatig": "Je maakt regelmatig gebruik van de inbegrepen games.",
                "Soms": "Je gebruikt de inbegrepen games slechts af en toe.",
                "Bijna nooit": "Je maakt nauwelijks gebruik van de inbegrepen games."
            },
            {
                "Heel vaak": "Online multiplayer is voor jou een belangrijk onderdeel van het abonnement.",
                "Regelmatig": "Je gebruikt online multiplayer regelmatig.",
                "Soms": "Je gebruikt online multiplayer slechts af en toe.",
                "Nooit": "Je gebruikt online multiplayer niet."
            },
            {
                "Nee": "Je hebt geen andere gamingabonnementen, waardoor er geen directe overlap is.",
                "1 ander": "Je betaalt daarnaast nog voor één ander gamingabonnement.",
                "2 andere": "Je hebt nog twee andere gamingabonnementen, waardoor er mogelijk overlap is.",
                "3 of meer": "Je betaalt voor meerdere gamingabonnementen, waardoor de kans op overlap groot is."
            },
            {
                "Absoluut": "Je vindt zelf dat je duidelijk voldoende waarde uit het abonnement haalt.",
                "Waarschijnlijk wel": "Je denkt dat je voldoende waarde uit het abonnement haalt.",
                "Ik twijfel": "Je twijfelt zelf of het abonnement voldoende waarde biedt.",
                "Nee": "Je vindt zelf dat het abonnement onvoldoende waarde biedt."
            }
        ],


        streaming: [
            null,
            {
                "Dagelijks": "Je gebruikt deze streamingdienst dagelijks.",
                "Enkele keren per week": "Je gebruikt deze streamingdienst meerdere keren per week.",
                "Af en toe": "Je gebruikt deze streamingdienst maar af en toe.",
                "Bijna nooit": "Je gebruikt deze streamingdienst bijna nooit."
            },
            {
                "Geen": "Je betaalt niet voor andere streamingdiensten.",
                "1 andere": "Je betaalt daarnaast voor één andere streamingdienst.",
                "2 andere": "Je betaalt daarnaast nog voor twee andere streamingdiensten.",
                "3 of meer": "Je betaalt voor meerdere andere streamingdiensten, waardoor overlap waarschijnlijk is."
            },
            {
                "Ja": "Je maakt goed gebruik van de functies van je abonnement.",
                "Grotendeels": "Je gebruikt het grootste deel van de beschikbare functies.",
                "Niet echt": "Je gebruikt maar een beperkt deel van de functies waarvoor je betaalt.",
                "Weet ik niet": "Je weet niet goed of je alle inbegrepen functies benut."
            },
            {
                "Zeer tevreden": "Je bent zeer tevreden over de prijs die je betaalt.",
                "Tevreden": "Je bent tevreden over de prijs van het abonnement.",
                "Twijfel": "Je twijfelt of de prijs nog in verhouding staat tot de waarde die je krijgt.",
                "Nee": "Je vindt de huidige prijs niet gerechtvaardigd."
            }
        ],


        muziek: [
            null,
            {
                "Dagelijks": "Je gebruikt deze muziekdienst dagelijks.",
                "Enkele keren per week": "Je gebruikt deze muziekdienst meerdere keren per week.",
                "Af en toe": "Je gebruikt deze muziekdienst maar af en toe.",
                "Bijna nooit": "Je gebruikt deze muziekdienst bijna nooit."
            },
            {
                "Ja, vaak": "Je maakt vaak gebruik van functies waarvoor een betaald abonnement nodig is.",
                "Soms": "Je gebruikt sommige premiumfuncties.",
                "Bijna nooit": "Je maakt nauwelijks gebruik van functies waarvoor je betaalt.",
                "Weet ik niet": "Het is niet duidelijk of je de premiumfuncties echt nodig hebt."
            },
            {
                "Nee": "Je betaalt niet voor andere muziekdiensten.",
                "1 andere": "Je betaalt daarnaast nog voor één andere muziekdienst.",
                "2 andere": "Je betaalt voor meerdere muziekdiensten, waardoor er mogelijk overlap is.",
                "Meer dan 2": "Je hebt verschillende betaalde muziekdiensten, waardoor overlap waarschijnlijk is."
            },
            {
                "Zeer tevreden": "Je bent zeer tevreden over je huidige muziekabonnement.",
                "Tevreden": "Je bent tevreden over je huidige muziekabonnement.",
                "Twijfel": "Je twijfelt of je huidige muziekabonnement nog de moeite waard is.",
                "Nee": "Je bent niet tevreden over je huidige muziekabonnement."
            }
        ],


        software: [
            {
                "Dagelijks": "Je gebruikt deze software dagelijks.",
                "Enkele keren per week": "Je gebruikt deze software meerdere keren per week.",
                "Af en toe": "Je gebruikt deze software maar af en toe.",
                "Bijna nooit": "Je gebruikt deze software bijna nooit."
            },
            null,
            {
                "Ja": "Je maakt goed gebruik van de functies waarvoor je betaalt.",
                "De meeste": "Je gebruikt het grootste deel van de beschikbare functies.",
                "Slechts enkele": "Je gebruikt slechts een beperkt deel van de beschikbare functies.",
                "Bijna geen": "Je maakt nauwelijks gebruik van de functies waarvoor je betaalt."
            },
            null,
            null
        ],


        cloud: [
            {
                "Minder dan 25%": "Je gebruikt minder dan een kwart van je beschikbare cloudopslag.",
                "25% tot 50%": "Je gebruikt minder dan de helft van je beschikbare cloudopslag.",
                "50% tot 80%": "Je benut een groot deel van je cloudopslag.",
                "Meer dan 80%": "Je gebruikt het grootste deel van je beschikbare cloudopslag."
            },
            null,
            {
                "Nee": "Je betaalt niet voor andere cloudopslag.",
                "1 andere dienst": "Je betaalt daarnaast nog voor een andere clouddienst.",
                "2 andere diensten": "Je betaalt voor meerdere clouddiensten.",
                "Meer dan 2": "Je betaalt voor verschillende clouddiensten, waardoor overlap waarschijnlijk is."
            },
            null,
            {
                "Ja": "Je geeft aan dat je momenteel meer opslag hebt dan je nodig hebt.",
                "Misschien": "Je twijfelt of je huidige opslagpakket niet groter is dan nodig.",
                "Nee": "Je huidige opslagcapaciteit lijkt passend bij je behoefte.",
                "Weet ik niet": "Je weet niet zeker of je huidige opslagpakket passend is."
            }
        ],


        internet: [
            null,
            null,
            {
                "Zeer tevreden": "Je bent zeer tevreden over je huidige internetsnelheid.",
                "Meestal tevreden": "Je bent meestal tevreden over je internetsnelheid.",
                "Soms te traag": "Je ervaart dat je internet soms te traag is.",
                "Vaak te traag": "Je ervaart regelmatig problemen met een te trage verbinding."
            },
            {
                "Nooit": "Je hebt geen noemenswaardige wifi-problemen.",
                "Soms": "Je ervaart af en toe problemen met wifi.",
                "Regelmatig": "Je hebt regelmatig problemen met wifi in huis.",
                "Heel vaak": "Wifi-problemen komen bij jou heel vaak voor."
            },
            null
        ],


        telefonie: [
            null,
            null,
            {
                "Heel veel": "Je houdt iedere maand veel mobiele data over.",
                "Een beetje": "Je houdt meestal nog wat mobiele data over.",
                "Bijna niets": "Je databundel sluit vrij goed aan bij je werkelijke gebruik.",
                "Ik kom data tekort": "Je huidige databundel is regelmatig te klein."
            },
            null,
            null
        ],


        tv: [
            {
                "Dagelijks": "Je kijkt dagelijks klassieke televisie.",
                "Enkele keren per week": "Je kijkt meerdere keren per week klassieke televisie.",
                "Af en toe": "Je kijkt maar af en toe klassieke televisie.",
                "Bijna nooit": "Je kijkt bijna nooit klassieke televisie."
            },
            {
                "Vooral live-tv": "Live televisie blijft voor jou belangrijk.",
                "Beide ongeveer evenveel": "Je combineert klassieke televisie en streaming.",
                "Vooral streaming": "Je kijkt vooral via streamingdiensten.",
                "Bijna geen van beide": "Je maakt weinig gebruik van zowel klassieke televisie als streaming."
            },
            null,
            null,
            {
                "Ja": "Je denkt dat je zonder klassiek tv-abonnement kunt.",
                "Waarschijnlijk wel": "Je denkt dat je waarschijnlijk zonder klassiek tv-abonnement kunt.",
                "Waarschijnlijk niet": "Je verwacht klassiek tv nog nodig te hebben.",
                "Nee": "Een klassiek tv-abonnement blijft voor jou belangrijk."
            }
        ],

        /* ==========================================================
   ENERGIE
========================================================== */

energie: [
    {
        "Vaste prijs": "Je hebt gekozen voor prijszekerheid met een vast energietarief.",
        "Variabele prijs": "Je energietarief beweegt mee met de marktprijzen.",
        "Dynamische prijs": "Je gebruikt een dynamisch energietarief dat sterk afhankelijk is van het moment van verbruik.",
        "Weet ik niet": "Je weet momenteel niet welk type energietarief je hebt."
    },
    {
        "Ja": "Je hebt zonnepanelen, wat invloed kan hebben op welk energietarief het beste bij je past.",
        "Nee": "Je hebt momenteel geen zonnepanelen.",
        "Binnenkort": "Je plant binnenkort zonnepanelen, waardoor je energiebehoefte mogelijk verandert.",
        "Weet ik niet": "Het is niet duidelijk of zonnepanelen een rol spelen in je energiecontract."
    },
    {
        "Laag": "Je geeft aan dat je elektriciteitsverbruik relatief laag is.",
        "Gemiddeld": "Je elektriciteitsverbruik ligt volgens jou rond het gemiddelde.",
        "Hoog": "Je hebt een relatief hoog elektriciteitsverbruik, waardoor tariefverschillen extra belangrijk kunnen zijn.",
        "Weet ik niet": "Je hebt momenteel weinig zicht op je werkelijke elektriciteitsverbruik."
    },
    {
        "Minder dan 6 maanden geleden": "Je hebt je energietarief recent nog vergeleken.",
        "6 tot 12 maanden geleden": "Je hebt je energietarief het afgelopen jaar nog vergeleken.",
        "Meer dan een jaar geleden": "Het is meer dan een jaar geleden dat je je energietarief hebt vergeleken.",
        "Nog nooit": "Je hebt je huidige energietarief nog nooit met alternatieven vergeleken."
    },
    null
],


/* ==========================================================
   WATER
========================================================== */

water: [
    null,
    {
        "Laag": "Je omschrijft je waterverbruik als laag.",
        "Gemiddeld": "Je waterverbruik ligt volgens jou rond het gemiddelde.",
        "Hoog": "Je geeft aan dat je waterverbruik relatief hoog is.",
        "Weet ik niet": "Je hebt momenteel weinig zicht op je waterverbruik."
    },
    {
        "Ja, regelmatig": "Je volgt je waterverbruik actief op.",
        "Soms": "Je kijkt af en toe naar je waterverbruik.",
        "Bijna nooit": "Je volgt je waterverbruik nauwelijks op.",
        "Nooit": "Je volgt je waterverbruik momenteel niet op."
    },
    {
        "Ja, meerdere": "Je gebruikt meerdere systemen of toestellen om water te besparen.",
        "Een paar": "Je hebt al enkele maatregelen genomen om water te besparen.",
        "Nee": "Je gebruikt momenteel geen specifieke waterbesparende systemen.",
        "Weet ik niet": "Je weet niet goed welke waterbesparende voorzieningen aanwezig zijn."
    },
    null
],


/* ==========================================================
   VERZEKERING
========================================================== */

verzekering: [
    {
        "Minder dan een jaar geleden": "Je hebt je verzekering vrij recent nog vergeleken.",
        "1 tot 2 jaar geleden": "Je hebt je verzekering één tot twee jaar geleden nog vergeleken.",
        "Meer dan 2 jaar geleden": "Het is meer dan twee jaar geleden dat je deze verzekering hebt vergeleken.",
        "Nog nooit": "Je hebt deze verzekering nog nooit met alternatieven vergeleken."
    },
    {
        "Ja, volledig": "Je weet goed welke dekkingen in je verzekering inbegrepen zijn.",
        "Grotendeels": "Je kent het grootste deel van de inbegrepen dekkingen.",
        "Niet echt": "Je hebt maar beperkt zicht op wat je verzekering precies dekt.",
        "Nee": "Je weet momenteel niet goed waarvoor je precies verzekerd bent."
    },
    {
        "Ja": "Je hebt meerdere verzekeringen bij dezelfde maatschappij.",
        "Nee": "Je verzekeringen zijn niet allemaal bij dezelfde maatschappij ondergebracht.",
        "Gedeeltelijk": "Een deel van je verzekeringen is bij dezelfde maatschappij ondergebracht.",
        "Weet ik niet": "Je weet niet zeker hoe je verzekeringen verdeeld zijn."
    },
    null,
    null
],


/* ==========================================================
   BANK & FINANCIEEL
========================================================== */

"bank & financieel": [
    {
        "Dagelijks": "Je gebruikt deze bankrekening dagelijks.",
        "Regelmatig": "Je gebruikt deze bankrekening regelmatig.",
        "Af en toe": "Je gebruikt deze rekening slechts af en toe.",
        "Bijna nooit": "Je maakt nauwelijks gebruik van deze bankrekening."
    },
    {
        "Ja": "Je betaalt voor deze rekening of dit bankpakket.",
        "Nee": "Je betaalt momenteel niets voor deze rekening.",
        "Gedeeltelijk": "Een deel van je bankdiensten is betalend.",
        "Weet ik niet": "Je weet niet precies welke kosten aan je bankpakket verbonden zijn."
    },
    {
        "Vaak": "Je gebruikt de extra voordelen van je bankpakket regelmatig.",
        "Soms": "Je gebruikt sommige extra voordelen van je bankpakket.",
        "Bijna nooit": "Je maakt nauwelijks gebruik van de extra voordelen waarvoor je mogelijk betaalt.",
        "Weet ik niet": "Je weet niet goed welke extra voordelen je bankpakket bevat."
    },
    {
        "Nee": "Je hebt je bankzaken bij één bank geconcentreerd.",
        "2 banken": "Je gebruikt momenteel twee verschillende banken.",
        "3 banken": "Je hebt rekeningen bij drie verschillende banken.",
        "Meer dan 3": "Je gebruikt meerdere banken, waardoor er mogelijk overlap in diensten of kosten is."
    },
    null
],


/* ==========================================================
   LIDMAATSCHAP
========================================================== */

lidmaatschap: [
    {
        "Heel vaak": "Je maakt heel vaak gebruik van dit lidmaatschap.",
        "Regelmatig": "Je gebruikt dit lidmaatschap regelmatig.",
        "Af en toe": "Je maakt slechts af en toe gebruik van dit lidmaatschap.",
        "Bijna nooit": "Je gebruikt dit lidmaatschap bijna nooit."
    },
    {
        "Bijna allemaal": "Je benut bijna alle voordelen van je lidmaatschap.",
        "Meerdere": "Je maakt gebruik van meerdere inbegrepen voordelen.",
        "Slechts één of twee": "Je gebruikt maar een klein deel van de voordelen waarvoor je betaalt.",
        "Geen": "Je maakt momenteel geen gebruik van de voordelen van het lidmaatschap."
    },
    null,
    {
        "Recent": "Je hebt recent nog bekeken of dit lidmaatschap nuttig voor je is.",
        "Dit jaar": "Je hebt dit jaar nog beoordeeld of je het lidmaatschap nodig hebt.",
        "Meer dan een jaar geleden": "Het is meer dan een jaar geleden dat je dit lidmaatschap opnieuw hebt geëvalueerd.",
        "Nog nooit": "Je hebt nog nooit bekeken of dit lidmaatschap nog bij je past."
    },
    {
        "Zeker": "Je zou dit lidmaatschap duidelijk missen als je het stopzet.",
        "Waarschijnlijk": "Je verwacht dat je dit lidmaatschap waarschijnlijk zou missen.",
        "Waarschijnlijk niet": "Je denkt dat je het lidmaatschap waarschijnlijk niet zou missen.",
        "Nee": "Je verwacht het lidmaatschap niet te missen als je het stopzet."
    }
],


/* ==========================================================
   FITNESS & SPORT
========================================================== */

"fitness & sport": [
    {
        "3 keer of meer per week": "Je sport drie keer of meer per week en gebruikt je abonnement intensief.",
        "1 tot 2 keer per week": "Je sport één tot twee keer per week en gebruikt je abonnement regelmatig.",
        "Enkele keren per maand": "Je maakt slechts enkele keren per maand gebruik van je sportabonnement.",
        "Bijna nooit": "Je maakt bijna nooit gebruik van je sportabonnement."
    },
    {
        "Ja, regelmatig": "Je gebruikt ook regelmatig extra diensten die in je abonnement zitten.",
        "Soms": "Je maakt af en toe gebruik van extra diensten.",
        "Bijna nooit": "Je gebruikt de extra diensten nauwelijks.",
        "Er zijn geen extra diensten": "Je abonnement bevat geen extra diensten om rekening mee te houden."
    },
    {
        "Maandelijks opzegbaar": "Je abonnement is flexibel en maandelijks opzegbaar.",
        "Jaarcontract": "Je zit momenteel aan een jaarcontract vast.",
        "Langere looptijd": "Je sportabonnement heeft een langere contractduur.",
        "Weet ik niet": "Je weet momenteel niet hoe flexibel je sportabonnement is."
    },
    {
        "Zeer tevreden": "Je bent zeer tevreden over de locatie en faciliteiten.",
        "Tevreden": "Je bent tevreden over de locatie en faciliteiten.",
        "Twijfel": "Je twijfelt of de locatie en faciliteiten nog voldoende bij je passen.",
        "Nee": "Je bent niet tevreden over de locatie of faciliteiten."
    },
    {
        "Waarschijnlijk wel": "Je denkt dat een goedkoper sportabonnement waarschijnlijk voldoende zou zijn.",
        "Misschien": "Je vermoedt dat een goedkoper abonnement mogelijk voldoende kan zijn.",
        "Waarschijnlijk niet": "Je verwacht dat een goedkoper abonnement waarschijnlijk niet aan je behoeften voldoet.",
        "Nee": "Je verwacht dat je huidige abonnementsniveau nodig blijft."
    }
],


/* ==========================================================
   AUTO & MOBILITEIT
========================================================== */

"auto & mobiliteit": [
    null,
    {
        "Dagelijks": "Je gebruikt het voertuig dagelijks.",
        "Meerdere keren per week": "Je gebruikt het voertuig meerdere keren per week.",
        "Af en toe": "Je gebruikt het voertuig slechts af en toe.",
        "Bijna nooit": "Je gebruikt het voertuig bijna nooit."
    },
    {
        "Ja, volledig": "Onderhoud en andere diensten zijn volledig in je contract inbegrepen.",
        "Gedeeltelijk": "Een deel van het onderhoud of de dienstverlening is inbegrepen.",
        "Nee": "Onderhoud en aanvullende diensten zijn niet inbegrepen.",
        "Weet ik niet": "Je weet niet precies welke diensten in het contract inbegrepen zijn."
    },
    {
        "Ja": "Je weet precies wanneer je voertuigcontract eindigt.",
        "Ongeveer": "Je weet ongeveer wanneer je contract afloopt.",
        "Nee": "Je weet momenteel niet wanneer het contract eindigt.",
        "Niet van toepassing": "Voor dit contract is geen klassieke einddatum van toepassing."
    },
    {
        "Zeer tevreden": "Je bent zeer tevreden over de totale maandelijkse kost.",
        "Tevreden": "Je bent tevreden over de totale maandelijkse kost.",
        "Twijfel": "Je twijfelt of de totale maandelijkse kost nog gerechtvaardigd is.",
        "Nee": "Je bent niet tevreden over de totale maandelijkse kost."
    }
],


/* ==========================================================
   GEZONDHEID
========================================================== */

gezondheid: [
    {
        "Heel regelmatig": "Je gebruikt deze gezondheidsdienst heel regelmatig.",
        "Regelmatig": "Je maakt regelmatig gebruik van deze dienst.",
        "Af en toe": "Je gebruikt deze dienst slechts af en toe.",
        "Bijna nooit": "Je maakt bijna nooit gebruik van deze dienst."
    },
    {
        "Ja": "Je gebruikt de inbegrepen diensten goed.",
        "De meeste": "Je benut het grootste deel van de inbegrepen diensten.",
        "Slechts enkele": "Je gebruikt slechts enkele van de inbegrepen diensten.",
        "Bijna geen": "Je maakt nauwelijks gebruik van de diensten waarvoor je betaalt."
    },
    null,
    {
        "Nee": "Je hebt geen vergelijkbare diensten elders.",
        "Een paar": "Je gebruikt daarnaast nog enkele vergelijkbare diensten.",
        "Ja, meerdere": "Je gebruikt meerdere vergelijkbare diensten, waardoor overlap mogelijk is.",
        "Weet ik niet": "Je weet niet goed of er overlap met andere diensten bestaat."
    },
    {
        "Zeer tevreden": "Je bent zeer tevreden over de prijs-kwaliteitverhouding.",
        "Tevreden": "Je bent tevreden over de prijs-kwaliteitverhouding.",
        "Twijfel": "Je twijfelt of de prijs nog in verhouding staat tot wat je krijgt.",
        "Nee": "Je bent niet tevreden over de prijs-kwaliteitverhouding."
    }
],


/* ==========================================================
   MEDIA
========================================================== */

media: [
    {
        "Dagelijks": "Je gebruikt dit media-abonnement dagelijks.",
        "Enkele keren per week": "Je gebruikt dit media-abonnement meerdere keren per week.",
        "Af en toe": "Je gebruikt dit media-abonnement maar af en toe.",
        "Bijna nooit": "Je gebruikt dit media-abonnement bijna nooit."
    },
    null,
    {
        "Ja, heel vaak": "Je gebruikt veel van de content waarvoor je betaalt.",
        "Regelmatig": "Je maakt regelmatig gebruik van de beschikbare content.",
        "Slechts een deel": "Je gebruikt slechts een deel van de content waarvoor je betaalt.",
        "Bijna nooit": "Je maakt nauwelijks gebruik van de betaalde content."
    },
    {
        "Nee": "Je hebt geen andere betaalde media-abonnementen.",
        "1 ander": "Je hebt daarnaast nog één ander media-abonnement.",
        "2 andere": "Je betaalt voor meerdere media-abonnementen.",
        "3 of meer": "Je hebt verschillende betaalde media-abonnementen, waardoor overlap mogelijk is."
    },
    {
        "Zeker": "Je vindt de abonnementsprijs duidelijk gerechtvaardigd.",
        "Waarschijnlijk wel": "Je vindt de prijs waarschijnlijk gerechtvaardigd.",
        "Ik twijfel": "Je twijfelt of de abonnementsprijs nog gerechtvaardigd is.",
        "Nee": "Je vindt de abonnementsprijs niet gerechtvaardigd."
    }
],


/* ==========================================================
   AI
========================================================== */

ai: [
    {
        "Dagelijks": "Je gebruikt deze AI-dienst dagelijks.",
        "Enkele keren per week": "Je gebruikt deze AI-dienst meerdere keren per week.",
        "Af en toe": "Je gebruikt deze AI-dienst maar af en toe.",
        "Bijna nooit": "Je gebruikt deze AI-dienst bijna nooit."
    },
    {
        "Werk": "Je gebruikt deze AI-dienst voornamelijk voor je werk.",
        "Privé": "Je gebruikt deze AI-dienst voornamelijk privé.",
        "Studie": "Je gebruikt deze AI-dienst voornamelijk voor studie.",
        "Meerdere toepassingen": "Je gebruikt deze AI-dienst voor verschillende toepassingen."
    },
    {
        "Ja, heel vaak": "Je gebruikt vaak functies die alleen in de betaalde versie beschikbaar zijn.",
        "Regelmatig": "Je maakt regelmatig gebruik van betaalde functies.",
        "Bijna nooit": "Je maakt nauwelijks gebruik van functies waarvoor een betaald abonnement nodig is.",
        "Weet ik niet": "Je weet niet goed of je daadwerkelijk betaalde functies gebruikt."
    },
    {
        "Nee": "Je betaalt niet voor andere AI-diensten.",
        "1 andere": "Je betaalt daarnaast nog voor één andere AI-dienst.",
        "2 andere": "Je betaalt voor meerdere AI-diensten.",
        "3 of meer": "Je betaalt voor verschillende AI-diensten, waardoor overlap waarschijnlijk is."
    },
    {
        "Waarschijnlijk wel": "Je denkt dat de gratis versie waarschijnlijk voldoende zou zijn.",
        "Misschien": "Je vermoedt dat de gratis versie mogelijk voldoende kan zijn.",
        "Waarschijnlijk niet": "Je verwacht dat de gratis versie waarschijnlijk onvoldoende is.",
        "Zeker niet": "Je hebt de betaalde functies duidelijk nodig."
    }
],


/* ==========================================================
   BEVEILIGING
========================================================== */

beveiliging: [
    null,
    {
        "Dagelijks": "Je gebruikt of controleert deze beveiligingsdienst dagelijks.",
        "Regelmatig": "Je gebruikt deze beveiligingsdienst regelmatig.",
        "Af en toe": "Je maakt slechts af en toe actief gebruik van de beveiligingsdienst.",
        "Bijna nooit": "Je gebruikt de beveiligingsdienst nauwelijks actief."
    },
    {
        "Ja": "Professionele opvolging is in je beveiligingsabonnement inbegrepen.",
        "Nee": "Je abonnement bevat geen professionele opvolging.",
        "Gedeeltelijk": "Professionele opvolging is gedeeltelijk inbegrepen.",
        "Weet ik niet": "Je weet niet precies welke professionele opvolging inbegrepen is."
    },
    {
        "Minder dan een jaar geleden": "Je hebt de prijs en voorwaarden recent nog vergeleken.",
        "1 tot 2 jaar geleden": "Je hebt de prijs of voorwaarden één tot twee jaar geleden vergeleken.",
        "Meer dan 2 jaar geleden": "Het is meer dan twee jaar geleden dat je alternatieven hebt vergeleken.",
        "Nog nooit": "Je hebt deze beveiligingsdienst nog nooit met alternatieven vergeleken."
    },
    {
        "Zeer tevreden": "Je bent zeer tevreden over de prijs-kwaliteitverhouding.",
        "Tevreden": "Je bent tevreden over de prijs-kwaliteitverhouding.",
        "Twijfel": "Je twijfelt of de huidige prijs nog in verhouding staat tot de dienstverlening.",
        "Nee": "Je bent niet tevreden over de prijs-kwaliteitverhouding."
    }
],


/* ==========================================================
   WONEN & HUISHOUDEN
========================================================== */

"wonen & huishouden": [
    null,
    {
        "Regelmatig": "Je maakt regelmatig gebruik van deze dienst.",
        "Enkele keren per jaar": "Je gebruikt deze dienst enkele keren per jaar.",
        "Zelden": "Je hebt deze dienst maar zelden nodig.",
        "Bijna nooit": "Je maakt bijna nooit gebruik van deze dienst."
    },
    {
        "Ja, volledig": "Onderdelen of interventies zijn volledig inbegrepen.",
        "Gedeeltelijk": "Een deel van de onderdelen of interventies is inbegrepen.",
        "Nee": "Onderdelen en interventies zijn niet in het contract inbegrepen.",
        "Weet ik niet": "Je weet niet precies wat er in het contract inbegrepen is."
    },
    {
        "Recent": "Je hebt recent nog alternatieve aanbieders bekeken.",
        "Een tijdje geleden": "Het is enige tijd geleden dat je alternatieven hebt bekeken.",
        "Nog nooit": "Je hebt deze dienst nog nooit met andere aanbieders vergeleken.",
        "Er zijn weinig alternatieven": "Er lijken voor deze dienst weinig directe alternatieven beschikbaar."
    },
    {
        "Zeker": "Je vindt de huidige kost duidelijk gerechtvaardigd.",
        "Waarschijnlijk wel": "Je vindt de huidige kost waarschijnlijk gerechtvaardigd.",
        "Ik twijfel": "Je twijfelt of de huidige kost nog gerechtvaardigd is.",
        "Nee": "Je vindt de huidige kost niet gerechtvaardigd."
    }
],


/* ==========================================================
   HOSTING & WEBSITES
========================================================== */

"hosting & websites": [
    null,
    {
        "Essentieel": "Deze dienst is essentieel voor jou.",
        "Belangrijk": "Deze dienst is belangrijk voor je dagelijkse activiteiten.",
        "Handig maar niet essentieel": "De dienst is nuttig, maar niet essentieel.",
        "Nauwelijks belangrijk": "Deze dienst is momenteel nauwelijks belangrijk voor je."
    },
    {
        "Ja": "Je maakt goed gebruik van de inbegrepen functies.",
        "De meeste": "Je gebruikt het grootste deel van de beschikbare functies.",
        "Slechts enkele": "Je gebruikt maar een beperkt deel van de functies waarvoor je betaalt.",
        "Bijna geen": "Je maakt nauwelijks gebruik van de inbegrepen functies."
    },
    {
        "Ja, recent": "Je hebt de prijs recent nog met andere aanbieders vergeleken.",
        "Minder dan een jaar geleden": "Je hebt de prijs het afgelopen jaar nog vergeleken.",
        "Meer dan een jaar geleden": "Het is meer dan een jaar geleden dat je de prijs hebt vergeleken.",
        "Nog nooit": "Je hebt deze dienst nog nooit met andere aanbieders vergeleken."
    },
    {
        "Waarschijnlijk wel": "Je denkt dat een goedkoper pakket waarschijnlijk voldoende zou zijn.",
        "Misschien": "Een goedkoper pakket zou mogelijk voldoende kunnen zijn.",
        "Waarschijnlijk niet": "Je verwacht dat een goedkoper pakket waarschijnlijk onvoldoende is.",
        "Zeker niet": "Je huidige pakketniveau lijkt voor jou noodzakelijk."
    }
],


/* ==========================================================
   MAALTIJDEN & BEZORGING
========================================================== */

"maaltijden & bezorging": [
    {
        "Meerdere keren per week": "Je gebruikt deze dienst meerdere keren per week.",
        "Ongeveer wekelijks": "Je gebruikt deze dienst ongeveer één keer per week.",
        "Enkele keren per maand": "Je gebruikt deze dienst enkele keren per maand.",
        "Bijna nooit": "Je gebruikt deze dienst bijna nooit."
    },
    null,
    {
        "Nooit": "Je hebt geen last van ongebruikte bestellingen of tegoeden.",
        "Soms": "Je houdt soms ongebruikte bestellingen of tegoeden over.",
        "Regelmatig": "Je hebt regelmatig ongebruikte bestellingen of tegoeden.",
        "Heel vaak": "Je betaalt vaak voor bestellingen of tegoeden die je uiteindelijk niet gebruikt."
    },
    {
        "Nee": "Je gebruikt geen andere vergelijkbare maaltijd- of bezorgdiensten.",
        "1 andere": "Je gebruikt daarnaast nog één andere vergelijkbare dienst.",
        "2 andere": "Je gebruikt meerdere maaltijd- of bezorgdiensten.",
        "3 of meer": "Je gebruikt verschillende vergelijkbare diensten, waardoor overlap mogelijk is."
    },
    {
        "Absoluut": "Je vindt dat deze dienst je duidelijk voldoende waarde biedt.",
        "Waarschijnlijk wel": "Je vindt dat de dienst waarschijnlijk voldoende waarde biedt.",
        "Ik twijfel": "Je twijfelt of de dienst voldoende waarde biedt.",
        "Nee": "Je vindt dat deze dienst onvoldoende waarde biedt."
    }
],


/* ==========================================================
   BOEKEN & LEZEN
========================================================== */

"boeken & lezen": [
    {
        "Dagelijks": "Je gebruikt deze lees- of luisterdienst dagelijks.",
        "Enkele keren per week": "Je gebruikt deze dienst meerdere keren per week.",
        "Af en toe": "Je gebruikt de dienst slechts af en toe.",
        "Bijna nooit": "Je gebruikt deze dienst bijna nooit."
    },
    null,
    {
        "Zeker": "Je gebruikt de dienst voldoende om het abonnement goed te benutten.",
        "Waarschijnlijk wel": "Je benut het abonnement waarschijnlijk voldoende.",
        "Ik twijfel": "Je twijfelt of je voldoende leest of luistert om het abonnement te verantwoorden.",
        "Nee": "Je gebruikt de dienst onvoldoende om het abonnement goed te benutten."
    },
    {
        "Nee": "Je betaalt niet voor andere lees- of luisterdiensten.",
        "1 andere": "Je betaalt daarnaast nog voor één andere lees- of luisterdienst.",
        "2 andere": "Je betaalt voor meerdere lees- of luisterdiensten.",
        "3 of meer": "Je betaalt voor verschillende lees- of luisterdiensten, waardoor overlap mogelijk is."
    },
    {
        "Waarschijnlijk wel": "Je denkt dat afzonderlijke boeken kopen waarschijnlijk voordeliger zou zijn.",
        "Misschien": "Afzonderlijke boeken kopen zou mogelijk voordeliger kunnen zijn.",
        "Waarschijnlijk niet": "Je verwacht dat het abonnement voordeliger blijft dan losse aankopen.",
        "Zeker niet": "Je bent ervan overtuigd dat het abonnement voordeliger is dan losse aankopen."
    }
],


/* ==========================================================
   OVERIG
========================================================== */

overig: [
    {
        "Heel vaak": "Je maakt heel vaak gebruik van dit contract.",
        "Regelmatig": "Je maakt regelmatig gebruik van dit contract.",
        "Af en toe": "Je gebruikt dit contract slechts af en toe.",
        "Bijna nooit": "Je maakt bijna nooit gebruik van dit contract."
    },
    {
        "Zeker": "Je vindt dat je duidelijk voldoende waarde krijgt voor wat je betaalt.",
        "Waarschijnlijk wel": "Je vindt dat je waarschijnlijk voldoende waarde krijgt.",
        "Ik twijfel": "Je twijfelt of je voldoende waarde krijgt voor wat je betaalt.",
        "Nee": "Je vindt dat je onvoldoende waarde krijgt voor wat je betaalt."
    },
    {
        "Ja": "Je weet precies wanneer dit contract eindigt of verlengd wordt.",
        "Ongeveer": "Je weet ongeveer wanneer het contract eindigt of verlengd wordt.",
        "Nee": "Je weet momenteel niet wanneer het contract eindigt of verlengd wordt.",
        "Niet van toepassing": "Voor dit contract is geen klassieke eind- of verlengdatum van toepassing."
    },
    {
        "Recent": "Je hebt recent nog alternatieven bekeken.",
        "Een tijdje geleden": "Het is enige tijd geleden dat je alternatieven hebt bekeken.",
        "Nog nooit": "Je hebt nog nooit alternatieven voor dit contract bekeken.",
        "Er zijn geen alternatieven": "Er lijken momenteel geen duidelijke alternatieven voor dit contract te zijn."
    },
    {
        "Lagere prijs": "Voor jou ligt de grootste verbeterkans bij een lagere prijs.",
        "Betere voorwaarden": "Je zou vooral betere contractvoorwaarden willen.",
        "Meer flexibiliteit": "Je zou vooral meer flexibiliteit in het contract willen.",
        "Ik ben tevreden": "Je geeft aan dat je momenteel tevreden bent met het contract."
    }
]

    };


    const categoryInsights =
        insights[category];

    if (!categoryInsights) {
        return null;
    }

    const questionInsights =
        categoryInsights[index];

    if (!questionInsights) {
        return null;
    }

    return questionInsights[answer] || null;

}

/* ==========================================================
   CK AI - RESULTAAT
========================================================== */

function initCKAIResult() {

    const button =
        document.getElementById("ckaiViewResult");

    if (!button) return;

    button.addEventListener("click", () => {

        // Resultaatscherm verbergen
        document
            .getElementById("ckaiResultScreen")
            .classList.add("hidden");

        // Persoonlijke analyse tonen
        document
            .getElementById("ckaiAdviceScreen")
            .classList.remove("hidden");

            // Persoonlijke analyse invullen
const adviceTitle =
    document.getElementById("ckaiAdviceTitle");

const adviceContract =
    document.getElementById("ckaiAdviceContract");

const adviceStatus =
    document.getElementById("ckaiAdviceStatus");

if (ckaiEvaluationResult && ckaiCurrentContract) {

    adviceTitle.textContent =
    "Jouw resultaat";

    adviceContract.textContent =
        ckaiCurrentContract.name;

        const adviceLogo =
    document.getElementById("ckaiAdviceLogo");

if (adviceLogo) {

    const logo =
        ContractService.getLogo(
            ckaiCurrentContract.name
        );

    if (logo) {

        adviceLogo.innerHTML = `
            <img
                src="${resolveLogoSrc(logo)}"
                alt="${ckaiCurrentContract.name}">
        `;

    } else {

        const icon =
            ContractService.getCategoryIcon(
                ckaiCurrentContract.category
            );

        adviceLogo.innerHTML = `
            <i class="bi ${icon}"></i>
        `;

    }

}

    adviceStatus.textContent =
        ckaiEvaluationResult.title;

        const adviceStatusContainer =
    document.querySelector(".ckai-advice-status");

if (adviceStatusContainer) {

    adviceStatusContainer.classList.remove(
        "status-behouden",
        "status-optimaliseren",
        "status-herbekijken",
        "status-opzeggen"
    );

    adviceStatusContainer.classList.add(
        `status-${ckaiEvaluationResult.status}`
    );

}

// ===========================
// PREMIUM CTA
// ===========================

const premiumCta =
    document.getElementById("ckaiPremiumCta");

    const premiumCtaTitle =
    document.getElementById("ckaiPremiumCtaTitle");

const premiumCtaText =
    document.getElementById("ckaiPremiumCtaText");

if (premiumCta) {

    if (ckaiEvaluationResult.status === "behouden") {

        premiumCta.classList.add("hidden");

    } else {

    premiumCta.classList.remove("hidden");


    switch (ckaiEvaluationResult.status) {

        case "optimaliseren":

            premiumCtaTitle.textContent =
                "Er valt mogelijk meer uit te halen";

            premiumCtaText.textContent =
                "Ontdek met Premium waar je kunt optimaliseren en mogelijk besparen.";

            break;


        case "herbekijken":

            premiumCtaTitle.textContent =
                "Misschien is er een betere keuze";

            premiumCtaText.textContent =
                "Vergelijk met Premium je contract met mogelijke alternatieven.";

            break;


        case "opzeggen":

            premiumCtaTitle.textContent =
                "Bekijk betere alternatieven";

            premiumCtaText.textContent =
                "Ontdek met Premium welke alternatieven mogelijk beter bij je passen.";

            break;

    }

}

}


const premiumCtaButton =
    document.getElementById("ckaiPremiumCtaButton");

if (premiumCtaButton) {

    premiumCtaButton.onclick = () => {

        document
            .getElementById("ckaiAdviceScreen")
            ?.classList.add("hidden");

        document
            .getElementById("ckaiPremiumScreen")
            ?.classList.remove("hidden");

    };

}

        const adviceAnalysis =
    document.getElementById("ckaiAdviceAnalysis");

if (adviceAnalysis) {

    const answers =
        Object.values(ckaiAnswers);

    const contractKey =
        ckaiCurrentContract.name.toLowerCase();

    const categoryKey =
        ckaiCurrentContract.category.toLowerCase();

    const analysisKey =
        CKAI_SCORING[contractKey]
            ? contractKey
            : categoryKey;

    const scoring =
        CKAI_SCORING[analysisKey];

    const strongInsights = [];
    const normalInsights = [];


    ckaiQuestions.forEach((question, index) => {

        const answer =
            answers[index];

        if (!answer) return;

        const insight =
            getCKAIInsight(
                analysisKey,
                index,
                answer
            );

        if (!insight) return;


        const answerScore =
            scoring?.[index]?.[answer];


        if (
            typeof answerScore === "number" &&
            Math.abs(answerScore) >= 2
        ) {

            strongInsights.push(insight);

        } else {

            normalInsights.push(insight);

        }

    });


    const analysisParts = [];


    switch (ckaiEvaluationResult.status) {

        case "behouden":

            analysisParts.push(
                `${ckaiCurrentContract.name} lijkt goed bij je huidige gebruik te passen.`
            );

            break;

        case "optimaliseren":

            analysisParts.push(
                `${ckaiCurrentContract.name} biedt je voldoende waarde, al zijn er nog enkele mogelijkheden om te optimaliseren.`
            );

            break;

        case "herbekijken":

            analysisParts.push(
                `${ckaiCurrentContract.name} verdient op basis van je antwoorden opnieuw bekeken te worden.`
            );

            break;

        case "opzeggen":

            analysisParts.push(
                `${ckaiCurrentContract.name} lijkt momenteel niet optimaal aan te sluiten bij je gebruik en behoeften.`
            );

            break;

    }


    analysisParts.push(
        ...strongInsights.slice(0, 3)
    );


    if (strongInsights.length < 3) {

        analysisParts.push(
            ...normalInsights.slice(
                0,
                3 - strongInsights.length
            )
        );

    }


    adviceAnalysis.textContent =
        analysisParts.join(" ");

}

const monthlyCostElement =
    document.getElementById("ckaiAdviceMonthlyCost");

const yearlyCostElement =
    document.getElementById("ckaiAdviceYearlyCost");

const amount =
    Number(ckaiCurrentContract.amount) || 0;

let monthlyCost = 0;
let yearlyCost = 0;

switch (ckaiCurrentContract.frequency) {

    case "monthly":
        monthlyCost = amount;
        yearlyCost = amount * 12;
        break;

    case "quarterly":
        monthlyCost = amount / 3;
        yearlyCost = amount * 4;
        break;

    case "yearly":
        monthlyCost = amount / 12;
        yearlyCost = amount;
        break;

}

if (monthlyCostElement) {

    monthlyCostElement.textContent =
        ContractService.formatPrice(monthlyCost);

}

if (yearlyCostElement) {

    yearlyCostElement.textContent =
        ContractService.formatPrice(yearlyCost);

}

const adviceRecommendation =
    document.getElementById("ckaiAdviceRecommendation");

if (adviceRecommendation) {

    switch (ckaiEvaluationResult.status) {

        case "behouden":

            adviceRecommendation.textContent =
                `Dit abonnement sluit goed aan bij je huidige gebruik. Je lijkt voldoende waarde uit je abonnement te halen. Voor ${ContractService.formatPrice(monthlyCost)} per maand, oftewel ${ContractService.formatPrice(yearlyCost)} per jaar, lijkt behouden op dit moment een logische keuze.`;

            break;


        case "optimaliseren":

            adviceRecommendation.textContent =
                `Je haalt voldoende waarde uit dit abonnement om het te behouden. Je betaalt ${ContractService.formatPrice(monthlyCost)} per maand, oftewel ${ContractService.formatPrice(yearlyCost)} per jaar. Toch zijn er enkele signalen dat je mogelijk nog kunt optimaliseren. Bekijk regelmatig of je gebruik en de kost in verhouding blijven.`;

            break;


        case "herbekijken":

            adviceRecommendation.textContent =
                `Je gebruik en je eigen beoordeling geven aan dat dit abonnement mogelijk niet optimaal bij je past. Je betaalt ${ContractService.formatPrice(monthlyCost)} per maand, oftewel ${ContractService.formatPrice(yearlyCost)} per jaar. Bekijk je gebruik van de afgelopen maanden en overweeg een goedkoper abonnement of opzegging als je het weinig gebruikt.`;

            break;


        case "opzeggen":

            adviceRecommendation.textContent =
                `Op basis van je antwoorden lijkt dit abonnement momenteel weinig waarde te bieden. Je betaalt ${ContractService.formatPrice(monthlyCost)} per maand, oftewel ${ContractService.formatPrice(yearlyCost)} per jaar. Overweeg om het abonnement stop te zetten of te vervangen door een goedkoper alternatief.`;

            break;

    }

}

}

    });

}