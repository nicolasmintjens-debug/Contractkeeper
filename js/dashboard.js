/* ==========================================================
   ContractKeeper
   dashboard.js
========================================================== */

let categoryChart = null;

let currentSmartTip = 0;

let touchStartX = 0;

let currentCKAIHomeInsight = 0;

/* ==========================================================
   INSTELLINGEN - CONTRACTMELDINGEN
========================================================== */

function initContractNotificationsSetting() {

    const toggle =
        document.getElementById("contractNotifications");

    if (!toggle) return;

    const savedValue =
        localStorage.getItem("contractNotifications");

    if (savedValue !== null) {

        toggle.checked =
            savedValue === "true";

    }

    toggle.addEventListener("change", () => {

    localStorage.setItem(
        "contractNotifications",
        toggle.checked
    );

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

});

}

/* ==========================================================
   INSTELLINGEN - HERINNERING
========================================================== */

function initReminderSetting() {

    const setting =
        document.getElementById("reminderSetting");

    const value =
        document.getElementById("reminderValue");

    const sheet =
        document.getElementById("reminderSheet");

    if (!setting || !value || !sheet) return;

    const savedDays =
        localStorage.getItem("reminderDays");

    const reminderDays =
        savedDays !== null
            ? Number(savedDays)
            : 30;

    value.textContent =
        reminderDays === 0
            ? "Op de einddatum"
            : `${reminderDays} dagen vooraf`;

    setting.onclick = () => {

        sheet.classList.add("active");

    };

    sheet
        .querySelectorAll("[data-days]")
        .forEach(button => {

            button.onclick = () => {

                const days =
                    Number(button.dataset.days);

                localStorage.setItem(
                    "reminderDays",
                    days
                );

                value.textContent =
    days === 0
        ? "Op de einddatum"
        : `${days} dagen vooraf`;

if (typeof updateDashboard === "function") {
    updateDashboard();
}

sheet.classList.remove("active");

            };

        });

    const cancelButton =
        sheet.querySelector(".settings-sheet-cancel");

    if (cancelButton) {

        cancelButton.onclick = () => {

            sheet.classList.remove("active");

        };

    }

}

/* ==========================================================
   INSTELLINGEN - VALUTA
========================================================== */

function initCurrencySetting() {

    const setting =
        document.getElementById("currencySetting");

    const value =
        document.getElementById("currencyValue");

    const sheet =
        document.getElementById("currencySheet");

    if (!setting || !value || !sheet) return;

    const savedCurrency =
        localStorage.getItem("currency") || "EUR";

    const currencyLabels = {
        EUR: "Euro (€)",
        USD: "US Dollar ($)",
        GBP: "Britse pond (£)"
    };

    value.textContent =
        currencyLabels[savedCurrency] || "Euro (€)";

    setting.onclick = () => {

        sheet.classList.add("active");

    };

    sheet
        .querySelectorAll("[data-currency]")
        .forEach(button => {

            button.onclick = () => {

                const currency =
                    button.dataset.currency;

                localStorage.setItem(
    "currency",
    currency
);

value.textContent =
    currencyLabels[currency];

if (typeof updateDashboard === "function") {
    updateDashboard();
}

if (typeof renderContracts === "function") {
    renderContracts();
}

sheet.classList.remove("active");

            };

        });

    const cancelButton =
        sheet.querySelector(".settings-sheet-cancel");

    if (cancelButton) {

        cancelButton.onclick = () => {

            sheet.classList.remove("active");

        };

    }

}

/* ==========================================================
   INSTELLINGEN - GEGEVENS EXPORTEREN
========================================================== */

function initDataExport() {

    const exportSetting =
        document.getElementById("exportDataSetting");

    if (!exportSetting) return;

    exportSetting.onclick = () => {

        const backup = {

            version: 1,

            exportedAt:
                new Date().toISOString(),

            contracts:
                ContractService.getAll(),

            settings: {

                contractNotifications:
                    localStorage.getItem("contractNotifications") !== "false",

                reminderDays:
                    Number(localStorage.getItem("reminderDays") ?? 30),

                currency:
                    localStorage.getItem("currency") || "EUR"

            }

        };

        const json =
            JSON.stringify(backup, null, 2);

        const blob =
            new Blob(
                [json],
                {
                    type: "application/json"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        const date =
            new Date()
                .toISOString()
                .split("T")[0];

        link.href = url;

        link.download =
            `ContractKeeper-backup-${date}.json`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    };

}

/* ==========================================================
   INSTELLINGEN - GEGEVENS IMPORTEREN
========================================================== */

function initDataImport() {

    const importSetting =
        document.getElementById("importDataSetting");

    if (!importSetting) return;

    importSetting.onclick = () => {

        const fileInput =
            document.createElement("input");

        fileInput.type = "file";
        fileInput.accept = ".json,application/json";

        fileInput.onchange = () => {

            const file =
    fileInput.files[0];

if (!file) return;

const reader =
    new FileReader();

reader.onload = () => {

    try {

        const backup =
            JSON.parse(reader.result);

        const isValidBackup =
            backup &&
            backup.version === 1 &&
            Array.isArray(backup.contracts) &&
            backup.settings &&
            typeof backup.settings === "object";

        if (!isValidBackup) {

            alert(
                "Dit bestand is geen geldige ContractKeeper-back-up."
            );

            return;
        }

        console.log(
    "Geldige ContractKeeper-back-up:",
    backup
);

const confirmed =
    confirm(
        `Deze back-up bevat ${backup.contracts.length} contracten.\n\n` +
        `Je huidige gegevens worden vervangen.\n\n` +
        `Wil je doorgaan?`
    );

if (!confirmed) {
    return;
}

const normalizedContracts =
    backup.contracts.map(
        contract =>
            Storage.normalizeContract(contract)
    );

Storage.saveContracts(
    normalizedContracts
);

if (backup.settings) {

    localStorage.setItem(
        "contractNotifications",
        String(
            backup.settings.contractNotifications !== false
        )
    );

    localStorage.setItem(
        "reminderDays",
        String(
            backup.settings.reminderDays ?? 30
        )
    );

    localStorage.setItem(
        "currency",
        backup.settings.currency || "EUR"
    );

}

alert(
    "Back-up succesvol geïmporteerd."
);

window.location.reload();

    } catch (error) {

        alert(
            "Het geselecteerde bestand kon niet worden gelezen."
        );

    }

};

reader.readAsText(file);

        };

        fileInput.click();

    };

}

/* ==========================================================
   INSTELLINGEN - ALLE CONTRACTEN VERWIJDEREN
========================================================== */

function initDeleteAllData() {

    const deleteSetting =
        document.getElementById("deleteAllDataSetting");

    if (!deleteSetting) return;

    deleteSetting.onclick = () => {

        const contracts =
            ContractService.getAll();

        if (contracts.length === 0) {

            alert(
                "Er zijn geen contracten om te verwijderen."
            );

            return;
        }

        const confirmed =
            confirm(
                `Je staat op het punt om ${contracts.length} contracten permanent te verwijderen.\n\n` +
                `Deze actie kan niet ongedaan worden gemaakt.\n\n` +
                `Wil je doorgaan?`
            );

        if (!confirmed) {
            return;
        }

        Storage.clear();

        alert(
            "Alle contracten zijn verwijderd."
        );

        window.location.reload();

    };

}

/* ==========================================================
   INSTELLINGEN - CONTROLEER OP UPDATES
========================================================== */

function initUpdateCheckSetting() {

    const updateSetting =
        document.getElementById("checkUpdatesSetting");

    if (!updateSetting) return;

    updateSetting.onclick = async () => {

        if (typeof checkAppVersion === "function") {

            await checkAppVersion(true);

        }

    };

}

/* ==========================================================
   INSTELLINGEN - OVER CONTRACTKEEPER
========================================================== */

function initAboutSetting() {

    const aboutSetting =
        document.getElementById("aboutSetting");

    const aboutSheet =
        document.getElementById("aboutSheet");

    const closeButton =
        document.getElementById("closeAboutSheet");

    const aboutVersion =
        document.getElementById("aboutVersion");

    if (!aboutSetting || !aboutSheet) return;

    if (
        aboutVersion &&
        typeof APP_VERSION !== "undefined"
    ) {

        aboutVersion.textContent =
            APP_VERSION;

    }

    aboutSetting.onclick = () => {

        aboutSheet.classList.add("active");

    };

    if (closeButton) {

        closeButton.onclick = () => {

            aboutSheet.classList.remove("active");

        };

    }

}

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

    const reminderDays =
    Number(localStorage.getItem("reminderDays") ?? 30);

const endingSoon =
    ContractService.getEndingSoonCount(reminderDays);

    element.textContent = endingSoon;

    if (!status) return;

    if (endingSoon === 0) {

    status.textContent = "Geen actie nodig";
    status.className = "mini-card-status";

} else if (endingSoon === 1) {

    status.textContent =
        reminderDays === 0
            ? "1 eindigt vandaag"
            : `1 binnen ${reminderDays} dagen`;

    status.className = "mini-card-status warning";

} else {

    status.textContent =
        reminderDays === 0
            ? `${endingSoon} eindigen vandaag`
            : `${endingSoon} binnen ${reminderDays} dagen`;

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

    const notificationsEnabled =
        localStorage.getItem("contractNotifications") !== "false";

    if (!notificationsEnabled) {

        count.textContent = "0";
        status.textContent = "Meldingen uit";
        status.className = "mini-card-status";

        return;

    }

    const reminderDays =
        Number(localStorage.getItem("reminderDays") ?? 30);

    const endingSoon =
        ContractService.getEndingSoonCount(reminderDays);

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

    // CK AI home-inhoud opnieuw tonen
document
    .querySelector("#page-ckai .ckai-card-header")
    ?.classList.remove("hidden");

document
    .querySelector("#page-ckai .ckai-tools")
    ?.classList.remove("hidden");

document
    .getElementById("openPremium")
    ?.classList.remove("hidden");

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

    // Oud Premium-advies verbergen
document
    .getElementById("ckaiPremiumPlanScreen")
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

function openContractAnalysis() {

    openCKAI();

    // CK AI Premium-home verbergen
    document
        .querySelector("#page-ckai .ckai-card-header")
        ?.classList.add("hidden");

    document
        .querySelector("#page-ckai .ckai-tools")
        ?.classList.add("hidden");

    document
        .getElementById("openPremium")
        ?.classList.add("hidden");

    // Gewone contractanalyse starten
    startCKAI();

}

function openCKAIPremium() {

    const hero =
        document.querySelector("#page-ckai .ckai-hero");

    const premiumScreen =
        document.getElementById("ckaiPremiumScreen");

    if (!premiumScreen) {
        console.error("CK AI Premium-scherm niet gevonden");
        return;
    }

    // CK AI home verbergen
    if (hero) {
        hero.style.display = "none";
    }

    // Andere CK AI schermen verbergen
    [
        "ckaiQuestionScreen",
        "ckaiAnalysisScreen",
        "ckaiResultScreen",
        "ckaiAdviceScreen",
        "ckaiPremiumPlanScreen"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.classList.add("hidden");

    });

    // Premium tonen
    premiumScreen.classList.remove("hidden");
    premiumScreen.style.display = "block";

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });

}

function closeCKAIPremium() {

    const premiumScreen =
        document.getElementById("ckaiPremiumScreen");

    const ckaiHero =
        document.querySelector("#page-ckai .ckai-hero");

    if (premiumScreen) {
        premiumScreen.classList.add("hidden");
        premiumScreen.style.display = "none";
    }

    if (ckaiHero) {
        ckaiHero.classList.remove("hidden");
        ckaiHero.style.display = "block";
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });

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

// Telecom: vragen aanpassen aan gekozen pakket
if (
    ckaiCurrentContract.category.toLowerCase() === "telecom" &&
    ckaiCurrentQuestion === 0
) {

    const telecomPack =
        ckaiAnswers[1];

    console.log(
        "Gekozen telecomPack:",
        telecomPack
    );

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

    if (score >= 5) {

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


// ===========================
// ANALYSE RESETTEN
// ===========================

steps.forEach((step, index) => {

    const stepElement =
        document.getElementById(
            `analysisStep${index + 1}`
        );

    if (stepElement) {

        stepElement.innerHTML =
            `<span class="analysis-waiting">○</span> ${step}`;

    }

});


const progressBar =
    document.getElementById("ckaiAnalysisProgressBar");

if (progressBar) {
    progressBar.style.width = "0%";
}

    let currentStep = 0;

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
            "Je antwoorden wijzen erop dat dit abonnement momenteel goed aansluit bij hoe je het gebruikt.";

        break;


    case "optimaliseren":

        resultText.textContent =
            "Je abonnement past redelijk goed bij je gebruik. CK AI ziet wel mogelijkheden om het beter af te stemmen op wat je nodig hebt.";

        break;


    case "herbekijken":

        resultText.textContent =
            "Op basis van je gebruik zijn er meerdere signalen dat dit abonnement mogelijk niet meer optimaal bij je past.";

        break;


    case "opzeggen":

        resultText.textContent =
            "Je gebruik wijst erop dat dit abonnement mogelijk onvoldoende waarde biedt om de huidige kosten te verantwoorden.";

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

telecom: [

    {
        "Alleen internet":
            "Je abonnement bestaat alleen uit internet. We beoordelen daarom vooral of je verbinding en totale prijs goed aansluiten bij je gebruik.",

        "Internet + TV":
            "Je hebt internet en televisie gebundeld in één telecomabonnement. Het is belangrijk om te bekijken of je beide onderdelen voldoende gebruikt.",

        "Internet + mobiel":
            "Je combineert internet en mobiel in één telecomabonnement. We bekijken of de volledige bundel voldoende waarde biedt.",

        "Internet + TV + mobiel":
            "Je hebt een volledig telecomabonnement met internet, televisie en mobiel. We beoordelen daarom het pakket als geheel en niet alleen de afzonderlijke onderdelen."
    },

    {
        "Zeer tevreden":
            "Je bent zeer tevreden over je internetverbinding.",

        "Tevreden":
            "Je bent tevreden over je internetverbinding.",

        "Soms problemen":
            "Je ervaart af en toe problemen met je internetverbinding.",

        "Vaak problemen":
            "Je ervaart regelmatig problemen met je internetverbinding."
    },

    {
        "Ja, allemaal":
            "Je gebruikt alle onderdelen waarvoor je betaalt.",

        "De meeste":
            "Je gebruikt de meeste onderdelen van je telecomabonnement.",

        "Slechts enkele":
            "Je gebruikt slechts een deel van de diensten waarvoor je betaalt.",

        "Nee":
            "Je betaalt voor onderdelen van je telecomabonnement die je niet of nauwelijks gebruikt."
    },

    {
        "Zeer tevreden":
            "Je bent zeer tevreden over de prijs van je volledige telecomabonnement.",

        "Tevreden":
            "Je bent tevreden over de prijs van je volledige telecomabonnement.",

        "Eerder duur":
            "Je vindt je telecomabonnement eerder duur.",

        "Veel te duur":
            "Je vindt dat je telecomabonnement veel te duur is."
    },

    {
        "Minder dan 6 maanden geleden":
            "Je hebt je telecomabonnement recent met andere aanbieders vergeleken.",

        "6 tot 12 maanden geleden":
            "Je hebt je telecomabonnement het afgelopen jaar nog vergeleken.",

        "Meer dan een jaar geleden":
            "Het is meer dan een jaar geleden dat je telecomabonnement nog werd vergeleken.",

        "Nog nooit":
            "Je hebt je huidige telecomabonnement nog nooit met andere aanbieders vergeleken."
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
   CK AI - PREMIUM ACTIEPUNTEN
========================================================== */

function getCKAIAction(category, index, answer) {

    const actions = {

        netflix: [

            {
                "Alleen ik":
                    "Controleer of een goedkoper Netflix-abonnement voldoende is wanneer je het account alleen gebruikt.",

                "2 personen":
                    "Controleer of je huidige Netflix-abonnement past bij het aantal personen dat het gebruikt.",

                "3 personen":
                    "Vergelijk je huidige abonnement met de Netflix-formules die passen bij meerdere gebruikers.",

                "4 of meer":
                    "Controleer of je huidige Netflix-formule voldoende gelijktijdige gebruikers ondersteunt."
            },

            {
                "Standard met reclame":
                    "Je gebruikt al een voordeligere Netflix-formule. Controleer vooral of je de dienst voldoende gebruikt.",

                "Standard":
                    "Vergelijk Standard met de goedkopere Netflix-formule en bepaal of de verschillen voor jou belangrijk zijn.",

                "Premium":
                    "Controleer of je de extra mogelijkheden van Netflix Premium werkelijk gebruikt voordat je ervoor blijft betalen.",

                "Weet ik niet":
                    "Controleer eerst welk Netflix-abonnement je momenteel hebt en welke functies daarin inbegrepen zijn."
            },

            {
                "Ja":
                    "Je gebruikt 4K. Houd daar rekening mee voordat je naar een goedkoper abonnement overstapt.",

                "Nee":
                    "Bekijk of een goedkoper Netflix-abonnement zonder 4K voldoende is voor jouw gebruik.",

                "Weet ik niet":
                    "Controleer of je daadwerkelijk 4K gebruikt voordat je blijft betalen voor een formule waarin dit een belangrijk voordeel is."
            },

            {
                "Dagelijks":
                    "Je gebruikt Netflix intensief. Vergelijk daarom vooral abonnementsniveaus in plaats van meteen opzeggen.",

                "Enkele keren per week":
                    "Bekijk of een goedkoper Netflix-abonnement dezelfde waarde kan bieden voor jouw kijkgedrag.",

                "Af en toe":
                    "Overweeg een goedkoper abonnement of Netflix tijdelijk stop te zetten wanneer je het weinig gebruikt.",

                "Bijna nooit":
                    "Overweeg Netflix stop te zetten en alleen opnieuw te activeren wanneer je de dienst daadwerkelijk wilt gebruiken."
            },

            {
                "Zeer tevreden":
                    "Je bent zeer tevreden. Focus vooral op de vraag of je huidige abonnementsniveau niet duurder is dan nodig.",

                "Tevreden":
                    "Controleer of je dezelfde tevredenheid kunt behouden met een goedkoper abonnementsniveau.",

                "Twijfel":
                    "Vergelijk je huidige Netflix-abonnement met een goedkoper niveau voordat de volgende betaling plaatsvindt.",

                "Nee":
                    "Overweeg je Netflix-abonnement te verlagen of stop te zetten als de dienst onvoldoende waarde biedt."
            }

        ],

                streaming: [

            null,

            {
                "Dagelijks":
                    "Je gebruikt deze streamingdienst intensief. Controleer vooral of je huidige abonnementsniveau niet duurder is dan nodig.",

                "Enkele keren per week":
                    "Vergelijk je huidige abonnement met een goedkoper alternatief dat nog steeds bij je kijkgedrag past.",

                "Af en toe":
                    "Overweeg een goedkoper abonnement of de streamingdienst tijdelijk stop te zetten wanneer je hem weinig gebruikt.",

                "Bijna nooit":
                    "Overweeg de streamingdienst stop te zetten en alleen opnieuw te activeren wanneer je hem daadwerkelijk wilt gebruiken."
            },

            {
                "Geen":
                    "Je hebt geen andere streamingdiensten. Controleer vooral of deze dienst voldoende waarde biedt voor de prijs die je betaalt.",

                "1 andere":
                    "Vergelijk beide streamingdiensten en controleer of je ze allebei voldoende gebruikt om twee abonnementen te rechtvaardigen.",

                "2 andere":
                    "Bekijk welke streamingdiensten je het meest gebruikt en overweeg minstens één minder gebruikte dienst tijdelijk stop te zetten.",

                "3 of meer":
                    "Je betaalt voor meerdere streamingdiensten. Overweeg abonnementen af te wisselen in plaats van ze allemaal tegelijk actief te houden."
            },

            {
                "Ja":
                    "Je benut de functies van je abonnement goed. Focus daarom vooral op prijs en gebruiksfrequentie voordat je iets wijzigt.",

                "Grotendeels":
                    "Controleer of een goedkoper abonnementsniveau dezelfde functies bevat die jij daadwerkelijk gebruikt.",

                "Niet echt":
                    "Bekijk of je kunt overstappen naar een goedkoper abonnement zonder functies te verliezen die voor jou belangrijk zijn.",

                "Weet ik niet":
                    "Controleer welke functies in je abonnement inbegrepen zijn en of je daarvoor werkelijk een duurder niveau nodig hebt."
            },

            {
                "Zeer tevreden":
                    "Je bent zeer tevreden over de prijs. Behouden is logisch zolang je de streamingdienst voldoende blijft gebruiken.",

                "Tevreden":
                    "Je bent tevreden over de prijs. Controleer vooral of je gebruik hoog genoeg blijft om het abonnement te behouden.",

                "Twijfel":
                    "Vergelijk de huidige prijs met een goedkoper abonnementsniveau of een andere streamingdienst voordat je volgende betaling plaatsvindt.",

                "Nee":
                    "Overweeg een goedkoper abonnement, een alternatief of tijdelijke stopzetting omdat je de huidige prijs onvoldoende gerechtvaardigd vindt."
            }

        ],

                gaming: [

            {
                "Dagelijks":
                    "Je gebruikt dit gamingabonnement intensief. Controleer vooral of je huidige abonnementsniveau niet uitgebreider is dan je nodig hebt.",

                "Enkele keren per week":
                    "Vergelijk je huidige gamingabonnement met een goedkoper niveau dat nog steeds bij je speelgedrag past.",

                "Af en toe":
                    "Overweeg een goedkoper abonnement of tijdelijke stopzetting wanneer je maar af en toe speelt.",

                "Bijna nooit":
                    "Overweeg het gamingabonnement stop te zetten en alleen opnieuw te activeren wanneer je het daadwerkelijk wilt gebruiken."
            },

            {
                "Bijna altijd":
                    "Je gebruikt de inbegrepen games intensief. Behouden kan interessant zijn zolang je hierdoor minder losse games hoeft te kopen.",

                "Regelmatig":
                    "Controleer of de games die je regelmatig speelt ook beschikbaar zijn in een goedkoper abonnementsniveau.",

                "Soms":
                    "Vergelijk de abonnementsprijs met wat je zou betalen als je alleen de games koopt die je daadwerkelijk speelt.",

                "Bijna nooit":
                    "Je gebruikt de inbegrepen games nauwelijks. Bekijk of een goedkoper abonnement of losse aankopen voordeliger zijn."
            },

            {
                "Heel vaak":
                    "Online multiplayer is belangrijk voor jou. Kies daarom alleen een goedkoper abonnement als multiplayer daarin behouden blijft.",

                "Regelmatig":
                    "Controleer welk goedkoper abonnementsniveau nog toegang geeft tot de online multiplayerfuncties die je gebruikt.",

                "Soms":
                    "Bekijk of je voor het beperkte multiplayergebruik een goedkoper abonnementsniveau kunt nemen.",

                "Nooit":
                    "Je gebruikt online multiplayer niet. Controleer of je betaalt voor een abonnementsniveau met functies die je niet nodig hebt."
            },

            {
                "Nee":
                    "Je hebt geen andere gamingabonnementen. Focus daarom vooral op gebruik en abonnementsniveau.",

                "1 ander":
                    "Vergelijk beide gamingabonnementen en controleer of ze voldoende verschillende voordelen bieden om beide te behouden.",

                "2 andere":
                    "Bekijk welke gamingabonnementen je het meest gebruikt en overweeg minstens één minder gebruikt abonnement stop te zetten.",

                "3 of meer":
                    "Je hebt meerdere gamingabonnementen. Overweeg ze af te wisselen in plaats van allemaal tegelijk actief te houden."
            },

            {
                "Absoluut":
                    "Je haalt duidelijk waarde uit het abonnement. Controleer alleen of een goedkoper niveau dezelfde belangrijkste voordelen biedt.",

                "Waarschijnlijk wel":
                    "Je haalt waarschijnlijk voldoende waarde uit het abonnement, maar een vergelijking met een goedkoper niveau kan interessant zijn.",

                "Ik twijfel":
                    "Vergelijk je huidige abonnement met een goedkoper niveau of alternatief voordat de volgende betaling plaatsvindt.",

                "Nee":
                    "Overweeg het abonnement te verlagen of stop te zetten omdat je zelf aangeeft er onvoldoende waarde uit te halen."
            }

        ],


        muziek: [

            null,

            {
                "Dagelijks":
                    "Je gebruikt deze muziekdienst intensief. Controleer vooral of je huidige formule niet uitgebreider is dan nodig.",

                "Enkele keren per week":
                    "Vergelijk je huidige abonnement met een goedkoper muziekabonnement dat nog steeds bij je luistergedrag past.",

                "Af en toe":
                    "Overweeg een goedkoper abonnement of tijdelijk de gratis versie te gebruiken als die beschikbaar is.",

                "Bijna nooit":
                    "Overweeg het betaalde muziekabonnement stop te zetten en een gratis alternatief te gebruiken."
            },

            {
                "Ja, vaak":
                    "Je gebruikt premiumfuncties vaak. Houd deze functies mee in rekening wanneer je een goedkoper alternatief vergelijkt.",

                "Soms":
                    "Controleer welke premiumfuncties je echt gebruikt en of een goedkoper abonnement die ook aanbiedt.",

                "Bijna nooit":
                    "Je gebruikt premiumfuncties nauwelijks. Bekijk of een gratis of goedkoper abonnement voldoende is.",

                "Weet ik niet":
                    "Controleer welke premiumfuncties in je abonnement zitten en of je ze daadwerkelijk gebruikt."
            },

            {
                "Nee":
                    "Je hebt geen andere betaalde muziekdiensten. Focus daarom vooral op gebruik en prijs van dit abonnement.",

                "1 andere":
                    "Vergelijk beide muziekdiensten en controleer of je ze allebei voldoende gebruikt om twee abonnementen te rechtvaardigen.",

                "2 andere":
                    "Je betaalt voor meerdere muziekdiensten. Kies welke je het meest gebruikt en overweeg minstens één abonnement stop te zetten.",

                "Meer dan 2":
                    "Je hebt verschillende betaalde muziekdiensten. Verminder overlap door één primaire muziekdienst te kiezen."
            },

            {
                "Zeer tevreden":
                    "Je bent zeer tevreden. Behouden is logisch zolang je de dienst voldoende gebruikt en de prijs passend blijft.",

                "Tevreden":
                    "Je bent tevreden. Controleer vooral of een goedkoper abonnement dezelfde functies biedt die voor jou belangrijk zijn.",

                "Twijfel":
                    "Vergelijk je huidige muziekdienst met een goedkoper abonnement of alternatief voordat de volgende betaling plaatsvindt.",

                "Nee":
                    "Overweeg een goedkoper alternatief of stopzetting omdat je niet tevreden bent over je huidige muziekabonnement."
            }

        ],


        "fitness & sport": [

            {
                "3 keer of meer per week":
                    "Je gebruikt je sportabonnement intensief. Behouden is logisch zolang prijs, locatie en faciliteiten goed bij je passen.",

                "1 tot 2 keer per week":
                    "Bereken of je huidige abonnement voordeliger blijft dan losse beurten of een goedkoper sportabonnement.",

                "Enkele keren per maand":
                    "Vergelijk je maandprijs met losse beurten of een goedkoper abonnement, omdat je maar enkele keren per maand gaat.",

                "Bijna nooit":
                    "Overweeg je sportabonnement stop te zetten of te vervangen door losse beurten als je bijna nooit gaat."
            },

            {
                "Ja, regelmatig":
                    "Je gebruikt de extra diensten regelmatig. Houd deze voordelen mee in rekening voordat je naar een goedkoper abonnement overstapt.",

                "Soms":
                    "Controleer of de extra diensten die je soms gebruikt de meerprijs van je huidige abonnement rechtvaardigen.",

                "Bijna nooit":
                    "Je gebruikt de extra diensten nauwelijks. Bekijk of een goedkoper abonnement zonder deze extra's voldoende is.",

                "Er zijn geen extra diensten":
                    "Je abonnement bevat geen extra diensten. Vergelijk daarom vooral prijs, locatie en gebruiksfrequentie."
            },

            {
                "Maandelijks opzegbaar":
                    "Je abonnement is flexibel. Daardoor kun je relatief eenvoudig overstappen of tijdelijk stoppen wanneer je gebruik afneemt.",

                "Jaarcontract":
                    "Controleer de einddatum en opzegvoorwaarden van je jaarcontract voordat je een wijziging plant.",

                "Langere looptijd":
                    "Controleer de resterende looptijd en voorwaarden voordat je beslist om van sportabonnement te veranderen.",

                "Weet ik niet":
                    "Controleer eerst de looptijd en opzegvoorwaarden van je sportabonnement voordat je een beslissing neemt."
            },

            {
                "Zeer tevreden":
                    "Je bent zeer tevreden over locatie en faciliteiten. Geef die voordelen voldoende gewicht bij een vergelijking met goedkopere opties.",

                "Tevreden":
                    "Je bent tevreden over locatie en faciliteiten. Vergelijk alleen alternatieven die praktisch even goed bij je passen.",

                "Twijfel":
                    "Bekijk of een andere sportclub betere faciliteiten, een betere locatie of een gunstigere prijs biedt.",

                "Nee":
                    "Vergelijk andere sportclubs of abonnementsvormen omdat de huidige locatie of faciliteiten onvoldoende bij je passen."
            },

            {
                "Waarschijnlijk wel":
                    "Vergelijk je huidige abonnement met een goedkoper sportabonnement; volgens je eigen inschatting zou dat waarschijnlijk voldoende zijn.",

                "Misschien":
                    "Bekijk welke onderdelen je werkelijk nodig hebt en vergelijk daarmee een goedkoper abonnement.",

                "Waarschijnlijk niet":
                    "Een goedkoper abonnement lijkt mogelijk minder geschikt. Zoek vooral naar besparing zonder belangrijke voordelen te verliezen.",

                "Zeker niet":
                    "Je hebt waarschijnlijk de mogelijkheden van je huidige abonnement nodig. Focus eerder op prijsvergelijking dan op downgraden."
            }

        ],

                energie: [

            {
                "Vaste prijs":
                    "Je hebt een vast energietarief. Vergelijk bij een volgende contractverlenging opnieuw met actuele tarieven om te controleren of de prijszekerheid de meerprijs waard is.",

                "Variabele prijs":
                    "Je hebt een variabel tarief. Vergelijk regelmatig met andere energiecontracten omdat je prijs mee verandert met de markt.",

                "Dynamische prijs":
                    "Controleer of je voldoende verbruik kunt verschuiven naar goedkope uren om echt voordeel uit een dynamisch tarief te halen.",

                "Weet ik niet":
                    "Controleer eerst op je contract of factuur welk type energietarief je hebt voordat je alternatieven vergelijkt."
            },

            {
                "Ja":
                    "Je hebt zonnepanelen. Vergelijk energiecontracten specifiek op voorwaarden die interessant zijn voor huishoudens met eigen productie.",

                "Nee":
                    "Je hebt geen zonnepanelen. Vergelijk contracten vooral op totale energiekost en voorwaarden die bij je verbruik passen.",

                "Binnenkort":
                    "Je plant zonnepanelen. Herbekijk je energiecontract zodra ze geplaatst zijn, omdat je verbruiksprofiel dan kan veranderen.",

                "Weet ik niet":
                    "Controleer eerst of zonnepanelen relevant zijn voor jouw aansluiting voordat je energietarieven verder vergelijkt."
            },

            {
                "Laag":
                    "Bij een laag verbruik kunnen vaste kosten relatief zwaar doorwegen. Vergelijk daarom niet alleen de prijs per kWh maar ook de vaste kosten.",

                "Gemiddeld":
                    "Vergelijk je totale jaarprijs met andere contracten op basis van je werkelijke jaarlijkse verbruik.",

                "Hoog":
                    "Bij een hoog energieverbruik kunnen kleine tariefverschillen sterk doorwegen. Een actuele prijsvergelijking kan daarom extra interessant zijn.",

                "Weet ik niet":
                    "Bekijk je jaarafrekening om je werkelijke verbruik te kennen voordat je energiecontracten vergelijkt."
            },

            {
                "Minder dan 6 maanden geleden":
                    "Je hebt recent vergeleken. Controleer vooral of je huidige contract nog overeenkomt met de voorwaarden waarop je toen gekozen hebt.",

                "6 tot 12 maanden geleden":
                    "Je laatste vergelijking is al enkele maanden geleden. Een nieuwe controle kan interessant zijn als tarieven ondertussen veranderd zijn.",

                "Meer dan een jaar geleden":
                    "Vergelijk je energiecontract opnieuw. Na meer dan een jaar kunnen prijzen en voorwaarden aanzienlijk veranderd zijn.",

                "Nog nooit":
                    "Voer een volledige vergelijking van je energiecontract uit om te controleren of je huidige tarief nog competitief is."
            },

            null

        ],

telecom: [

    {
        "Alleen internet":
            "Je hebt alleen internet in je telecomabonnement. Vergelijk vooral snelheid, stabiliteit en totale prijs met gelijkaardige internetformules.",

        "Internet + TV":
            "Je combineert internet en televisie. Vergelijk daarom altijd de prijs van het volledige pakket en controleer of je de tv-dienst voldoende gebruikt.",

        "Internet + mobiel":
            "Je combineert internet en mobiel. Vergelijk het volledige pakket met andere bundels en controleer of je mobiele formule aansluit bij je werkelijke gebruik.",

        "Internet + TV + mobiel":
            "Je combineert internet, televisie en mobiel. Vergelijk het volledige pakket met andere telecombundels en controleer of alle onderdelen nog voldoende waarde bieden."
    },

    {
        "Zeer tevreden":
            "Je internetverbinding werkt zeer goed voor jou. Een overstap puur voor betere prestaties lijkt daarom niet noodzakelijk.",

        "Tevreden":
            "Je bent tevreden over je internetverbinding. Vergelijk vooral prijs en pakketinhoud voordat je iets verandert.",

        "Soms problemen":
            "Je ervaart soms problemen met je internetverbinding. Controleer eerst of wifi, apparatuur of je provider de oorzaak is.",

        "Vaak problemen":
            "Je ervaart vaak problemen met je internetverbinding. Vergelijk andere formules of providers en controleer welke oplossing betere prestaties biedt."
    },

    {
        "Ja, allemaal":
            "Je gebruikt alle onderdelen van je telecomabonnement. De bundel lijkt daardoor goed aan te sluiten bij je gebruik.",

        "De meeste":
            "Je gebruikt de meeste onderdelen van je pakket. Controleer of het weinige dat je niet gebruikt een goedkopere formule mogelijk maakt.",

        "Slechts enkele":
            "Je gebruikt slechts enkele onderdelen waarvoor je betaalt. Een kleiner of anders samengesteld pakket kan mogelijk voordeliger zijn.",

        "Nee":
            "Je betaalt voor diensten die je nauwelijks gebruikt. Bekijk of je pakket kan worden verkleind of anders samengesteld."
    },

    {
        "Zeer tevreden":
            "Je bent zeer tevreden over de prijs van je pakket. Vergelijk eventueel nog met de markt om te bevestigen dat je huidige formule competitief blijft.",

        "Tevreden":
            "Je bent tevreden over de prijs. Een vergelijking kan aantonen of je dezelfde diensten elders goedkoper kunt krijgen.",

        "Eerder duur":
            "Je vindt je telecomabonnement eerder duur. Vergelijk je volledige pakket met andere formules en providers.",

        "Veel te duur":
            "Je vindt je telecomabonnement veel te duur. Een grondige vergelijking van andere pakketten en providers is sterk aangewezen."
    },

    {
        "Minder dan 6 maanden geleden":
            "Je hebt recent vergeleken. Je huidige pakket is daardoor waarschijnlijk nog redelijk actueel ten opzichte van de markt.",

        "6 tot 12 maanden geleden":
            "Je hebt het afgelopen jaar nog vergeleken. Controleer bij een volgende prijswijziging opnieuw of je pakket competitief blijft.",

        "Meer dan een jaar geleden":
            "Je hebt al meer dan een jaar niet vergeleken. Controleer opnieuw welke telecombundels momenteel beschikbaar zijn.",

        "Nog nooit":
            "Je hebt je telecomabonnement nog nooit vergeleken. Vergelijk je volledige pakket met alternatieven om te zien of je kunt besparen."
    }

],

        internet: [

            null,

            null,

            {
                "Zeer tevreden":
                    "Je bent zeer tevreden over je snelheid. Controleer of een goedkoper internetabonnement dezelfde snelheid kan bieden die je werkelijk nodig hebt.",

                "Meestal tevreden":
                    "Je huidige snelheid lijkt meestal voldoende. Vergelijk met een goedkoper snelheidsniveau voordat je je huidige formule behoudt.",

                "Soms te traag":
                    "Controleer eerst of de vertraging door je internetabonnement of door je wifi komt voordat je naar een duurder pakket overstapt.",

                "Vaak te traag":
                    "Vergelijk snellere internetformules of andere providers als je verbinding regelmatig te traag is."
            },

            {
                "Nooit":
                    "Je hebt geen wifi-problemen. Een duurder abonnement puur voor betere wifi lijkt daarom niet nodig.",

                "Soms":
                    "Controleer je router en wifi-bereik voordat je voor een duurder internetabonnement kiest.",

                "Regelmatig":
                    "Onderzoek eerst of betere wifi-apparatuur het probleem kan oplossen voordat je je internetabonnement verhoogt.",

                "Heel vaak":
                    "Controleer of je wifi-installatie of provider de oorzaak is van de problemen voordat je een nieuw abonnement kiest."
            },

            null

        ],


        telefonie: [

            null,

            null,

            {
                "Heel veel":
                    "Je houdt iedere maand veel mobiele data over. Vergelijk je abonnement met een kleinere en goedkopere databundel.",

                "Een beetje":
                    "Je houdt meestal data over. Controleer of een iets kleinere databundel voldoende is voor je werkelijke gebruik.",

                "Bijna niets":
                    "Je databundel sluit goed aan bij je gebruik. Vergelijk vooral de prijs met gelijkaardige abonnementen.",

                "Ik kom data tekort":
                    "Je databundel is regelmatig te klein. Vergelijk grotere bundels en controleer of die voordeliger zijn dan bijkomende datakosten."
            },

            null,

            null

        ],


        tv: [

            {
                "Dagelijks":
                    "Je kijkt dagelijks klassieke televisie. Behouden kan logisch zijn, maar vergelijk of een goedkoper tv-pakket voldoende zenders bevat.",

                "Enkele keren per week":
                    "Je gebruikt klassieke televisie regelmatig. Controleer of een kleiner tv-pakket dezelfde zenders bevat die je werkelijk bekijkt.",

                "Af en toe":
                    "Je kijkt maar af en toe klassieke televisie. Vergelijk de kost van je tv-abonnement met alternatieven zonder klassiek tv-pakket.",

                "Bijna nooit":
                    "Je kijkt bijna nooit klassieke televisie. Overweeg het tv-gedeelte van je pakket te schrappen als je provider dat toelaat."
            },

            {
                "Vooral live-tv":
                    "Live-tv blijft belangrijk voor jou. Vergelijk daarom vooral goedkopere tv-pakketten waarbij live televisie behouden blijft.",

                "Beide ongeveer evenveel":
                    "Je combineert live-tv en streaming. Controleer of je betaalt voor overlappende content of functies.",

                "Vooral streaming":
                    "Je kijkt vooral via streaming. Bekijk of je klassieke tv-abonnement nog voldoende waarde toevoegt.",

                "Bijna geen van beide":
                    "Je gebruikt zowel klassieke tv als streaming weinig. Herbekijk of je nog voor een uitgebreid entertainmentpakket wilt betalen."
            },

            null,

            null,

            {
                "Ja":
                    "Je denkt zonder klassieke televisie te kunnen. Bekijk hoeveel je kunt besparen door het tv-gedeelte uit je pakket te halen.",

                "Waarschijnlijk wel":
                    "Onderzoek een internetabonnement zonder klassiek tv-pakket en vergelijk het prijsverschil met je huidige formule.",

                "Waarschijnlijk niet":
                    "Klassieke televisie blijft waarschijnlijk nuttig voor jou. Vergelijk daarom eerder kleinere of goedkopere tv-pakketten.",

                "Nee":
                    "Klassieke televisie blijft belangrijk voor jou. Focus op een voordeliger pakket zonder de tv-functionaliteit te verliezen."
            }

        ],

                software: [

            {
                "Dagelijks":
                    "Je gebruikt deze software dagelijks. Behouden is logisch, maar controleer of een goedkoper abonnement dezelfde functies biedt die je nodig hebt.",

                "Enkele keren per week":
                    "Vergelijk je huidige softwareabonnement met een goedkoper niveau dat nog steeds aansluit bij je gebruik.",

                "Af en toe":
                    "Je gebruikt de software maar af en toe. Bekijk of een goedkoper abonnement of een alternatief zonder abonnement voordeliger is.",

                "Bijna nooit":
                    "Overweeg het softwareabonnement stop te zetten als je het bijna nooit gebruikt."
            },

            null,

            {
                "Ja":
                    "Je gebruikt de functies waarvoor je betaalt goed. Focus daarom vooral op prijs wanneer je alternatieven vergelijkt.",

                "De meeste":
                    "Je gebruikt de meeste functies. Controleer of een goedkoper abonnementsniveau dezelfde belangrijke functies bevat.",

                "Slechts enkele":
                    "Je gebruikt slechts enkele functies. Bekijk of een goedkoper abonnement of eenvoudiger alternatief voldoende is.",

                "Bijna geen":
                    "Je gebruikt nauwelijks de functies waarvoor je betaalt. Overweeg een goedkoper abonnement of een eenvoudiger alternatief."
            },

            null,

            null

        ],


        cloud: [

            {
                "Minder dan 25%":
                    "Je gebruikt minder dan een kwart van je opslagruimte. Controleer of je naar een kleiner en goedkoper opslagpakket kunt overstappen.",

                "25% tot 50%":
                    "Je gebruikt minder dan de helft van je opslagruimte. Vergelijk je huidige pakket met een kleinere opslagformule.",

                "50% tot 80%":
                    "Je gebruikt een groot deel van je opslag. Een kleiner pakket kan mogelijk te beperkt zijn, dus vergelijk de beschikbare opslaggrenzen zorgvuldig.",

                "Meer dan 80%":
                    "Je gebruikt bijna je volledige opslagcapaciteit. Behouden of uitbreiden kan logischer zijn dan downgraden."
            },

            null,

            {
                "Nee":
                    "Je betaalt niet voor andere cloudopslag. Focus daarom vooral op de grootte en prijs van je huidige pakket.",

                "1 andere dienst":
                    "Vergelijk beide clouddiensten en controleer of je opslag dubbel betaalt of dezelfde bestanden op meerdere plaatsen bewaart.",

                "2 andere diensten":
                    "Je betaalt voor meerdere clouddiensten. Bekijk of je opslag kunt bundelen bij één dienst en zo abonnementen kunt schrappen.",

                "Meer dan 2":
                    "Je gebruikt verschillende betaalde clouddiensten. Consolideer je opslag waar mogelijk om dubbele kosten te verminderen."
            },

            null,

            {
                "Ja":
                    "Je geeft zelf aan dat je meer opslag hebt dan nodig. Vergelijk onmiddellijk met een kleiner en goedkoper opslagpakket.",

                "Misschien":
                    "Controleer hoeveel opslag je werkelijk gebruikt en vergelijk dat met het eerstvolgende kleinere pakket.",

                "Nee":
                    "Je opslagcapaciteit lijkt goed bij je behoefte te passen. Vergelijk daarom vooral de prijs met soortgelijke diensten.",

                "Weet ik niet":
                    "Controleer eerst hoeveel opslagruimte je werkelijk gebruikt voordat je beslist of je pakket te groot is."
            }

        ],


        verzekering: [

            {
                "Minder dan een jaar geleden":
                    "Je hebt je verzekering recent vergeleken. Controleer vooral of premie en voorwaarden sindsdien niet gewijzigd zijn.",

                "1 tot 2 jaar geleden":
                    "Het is nuttig om je verzekering opnieuw te vergelijken om te controleren of premie en dekking nog competitief zijn.",

                "Meer dan 2 jaar geleden":
                    "Vergelijk je verzekering opnieuw. Na meer dan twee jaar kunnen premies, voorwaarden en alternatieven aanzienlijk veranderd zijn.",

                "Nog nooit":
                    "Voer een vergelijking uit met andere verzekeringen om te controleren of je huidige premie en dekking nog passend zijn."
            },

            {
                "Ja, volledig":
                    "Je kent je dekking goed. Gebruik die informatie om alternatieven met een vergelijkbare dekking te vergelijken.",

                "Grotendeels":
                    "Controleer de resterende voorwaarden en uitsluitingen voordat je je verzekering met alternatieven vergelijkt.",

                "Niet echt":
                    "Bekijk eerst welke dekkingen en uitsluitingen je verzekering bevat voordat je beslist of je huidige polis geschikt is.",

                "Nee":
                    "Controleer eerst waarvoor je precies verzekerd bent. Vergelijk niet alleen de prijs, maar vooral gelijkwaardige dekkingen."
            },

            {
                "Ja":
                    "Vraag na of je voordeel krijgt doordat meerdere verzekeringen bij dezelfde maatschappij zitten en vergelijk dat totaalvoordeel met alternatieven.",

                "Nee":
                    "Controleer of het bundelen van meerdere verzekeringen bij één maatschappij financieel voordeel kan opleveren.",

                "Gedeeltelijk":
                    "Vergelijk of verdere bundeling van je verzekeringen voordeel oplevert zonder belangrijke dekkingen te verliezen.",

                "Weet ik niet":
                    "Breng eerst in kaart bij welke maatschappijen je verzekeringen lopen en welke bundelkortingen je momenteel krijgt."
            },

            null,

            null

        ],


        "bank & financieel": [

            {
                "Dagelijks":
                    "Je gebruikt deze rekening dagelijks. Behouden kan logisch zijn, maar vergelijk de kosten met andere rekeningen die dezelfde functies bieden.",

                "Regelmatig":
                    "Je gebruikt deze rekening regelmatig. Controleer of je bankpakket niet uitgebreider en duurder is dan nodig.",

                "Af en toe":
                    "Je gebruikt deze rekening maar af en toe. Bekijk of een gratis of goedkoper bankpakket voldoende is.",

                "Bijna nooit":
                    "Je gebruikt deze rekening bijna nooit. Overweeg ze stop te zetten als er kosten aan verbonden zijn en je ze niet nodig hebt."
            },

            {
                "Ja":
                    "Je betaalt voor deze rekening of dit bankpakket. Vergelijk de jaarlijkse kost met gratis of goedkopere alternatieven.",

                "Nee":
                    "Je betaalt niets voor deze rekening. Behouden brengt daardoor weinig directe kosten mee zolang je ze nog nodig hebt.",

                "Gedeeltelijk":
                    "Controleer precies voor welke bankdiensten je betaalt en of je die functies werkelijk gebruikt.",

                "Weet ik niet":
                    "Controleer je tarievenlijst of rekeningafschriften om te bepalen hoeveel je jaarlijks voor je bankdiensten betaalt."
            },

            {
                "Vaak":
                    "Je gebruikt de extra voordelen regelmatig. Houd hun waarde mee in rekening wanneer je een goedkoper bankpakket vergelijkt.",

                "Soms":
                    "Controleer of de voordelen die je soms gebruikt de extra kost van je bankpakket rechtvaardigen.",

                "Bijna nooit":
                    "Je gebruikt de extra voordelen nauwelijks. Bekijk of een goedkoper basispakket voldoende is.",

                "Weet ik niet":
                    "Controleer welke extra voordelen je bankpakket bevat en of je ze daadwerkelijk gebruikt."
            },

            {
                "Nee":
                    "Je gebruikt één bank. Focus daarom vooral op de kosten en functies van je huidige bankpakket.",

                "2 banken":
                    "Controleer of je bij beide banken betalende diensten hebt en of er functies overlappen.",

                "3 banken":
                    "Je gebruikt drie banken. Breng de totale jaarlijkse bankkosten in kaart en controleer welke rekeningen je werkelijk nodig hebt.",

                "Meer dan 3":
                    "Je gebruikt meerdere banken. Overweeg je bankzaken te vereenvoudigen als je voor overlappende rekeningen of diensten betaalt."
            },

            null

        ],

                lidmaatschap: [

            {
                "Heel vaak":
                    "Je gebruikt dit lidmaatschap intensief. Behouden is logisch zolang de voordelen opwegen tegen de kost.",

                "Regelmatig":
                    "Je gebruikt het lidmaatschap regelmatig. Controleer of je voldoende voordeel haalt uit de prijs die je betaalt.",

                "Af en toe":
                    "Je gebruikt het lidmaatschap maar af en toe. Vergelijk de jaarlijkse kost met wat je afzonderlijk zou betalen voor de voordelen die je werkelijk gebruikt.",

                "Bijna nooit":
                    "Je gebruikt het lidmaatschap bijna nooit. Overweeg het stop te zetten als er geen andere belangrijke voordelen aan verbonden zijn."
            },

            {
                "Bijna allemaal":
                    "Je benut bijna alle voordelen. Het lidmaatschap lijkt daardoor functioneel goed bij je gebruik te passen.",

                "Meerdere":
                    "Je gebruikt meerdere voordelen. Controleer of hun gezamenlijke waarde de kost van het lidmaatschap rechtvaardigt.",

                "Slechts één of twee":
                    "Je gebruikt maar enkele voordelen. Vergelijk hun afzonderlijke waarde met de totale abonnementsprijs.",

                "Geen":
                    "Je gebruikt momenteel geen van de inbegrepen voordelen. Overweeg het lidmaatschap stop te zetten."
            },

            null,

            {
                "Recent":
                    "Je hebt het lidmaatschap recent geëvalueerd. Controleer vooral of je gebruik sindsdien veranderd is.",

                "Dit jaar":
                    "Je hebt het dit jaar nog beoordeeld. Plan een nieuwe controle wanneer je lidmaatschap vernieuwd wordt.",

                "Meer dan een jaar geleden":
                    "Evalueer opnieuw of het lidmaatschap nog voldoende waarde biedt voor wat je ervoor betaalt.",

                "Nog nooit":
                    "Beoordeel voor het eerst bewust welke voordelen je werkelijk gebruikt en of die de kost rechtvaardigen."
            },

            {
                "Zeker":
                    "Je zou het lidmaatschap duidelijk missen. Focus daarom eerder op een goedkoper niveau dan op volledig stopzetten.",

                "Waarschijnlijk":
                    "Controleer of een goedkoper lidmaatschapsniveau de voordelen behoudt die je waarschijnlijk zou missen.",

                "Waarschijnlijk niet":
                    "Overweeg het lidmaatschap tijdelijk stop te zetten om te beoordelen of je het werkelijk nodig hebt.",

                "Nee":
                    "Je verwacht het lidmaatschap niet te missen. Stopzetten kan daarom een concrete besparingsmogelijkheid zijn."
            }

        ],


        "auto & mobiliteit": [

            null,

            {
                "Dagelijks":
                    "Je gebruikt het voertuig dagelijks. Focus vooral op de totale maandelijkse kost en de diensten die in je contract inbegrepen zijn.",

                "Meerdere keren per week":
                    "Je gebruikt het voertuig regelmatig. Vergelijk de totale contractkost met alternatieven die bij hetzelfde gebruik passen.",

                "Af en toe":
                    "Je gebruikt het voertuig slechts af en toe. Controleer of de vaste maandelijkse kost nog past bij je beperkte gebruik.",

                "Bijna nooit":
                    "Je gebruikt het voertuig bijna nooit. Onderzoek of een alternatief met lagere vaste kosten beter aansluit bij je mobiliteitsbehoefte."
            },

            {
                "Ja, volledig":
                    "Onderhoud en diensten zijn volledig inbegrepen. Neem hun waarde mee wanneer je je contract met goedkopere alternatieven vergelijkt.",

                "Gedeeltelijk":
                    "Controleer welke onderhouds- en servicediensten inbegrepen zijn en welke kosten je nog zelf betaalt.",

                "Nee":
                    "Onderhoud is niet inbegrepen. Tel deze bijkomende kosten mee wanneer je de totale kost van het voertuig beoordeelt.",

                "Weet ik niet":
                    "Controleer je contract om te zien welke onderhouds- en servicediensten inbegrepen zijn voordat je alternatieven vergelijkt."
            },

            {
                "Ja":
                    "Je kent de einddatum. Plan ruim vóór die datum een vergelijking zodat je tijdig alternatieven kunt bekijken.",

                "Ongeveer":
                    "Controleer de exacte einddatum van je voertuigcontract zodat je tijdig kunt beslissen over verlengen of veranderen.",

                "Nee":
                    "Zoek de einddatum van je contract op en controleer welke voorwaarden gelden voor beëindiging of verlenging.",

                "Niet van toepassing":
                    "Er is geen klassieke einddatum. Controleer daarom vooral welke voorwaarden gelden als je het contract wilt wijzigen of stopzetten."
            },

            {
                "Zeer tevreden":
                    "Je bent zeer tevreden over de totale kost. Behouden kan logisch zijn zolang het contract goed bij je gebruik blijft passen.",

                "Tevreden":
                    "Je bent tevreden over de kost. Vergelijk bij de volgende contractbeslissing met soortgelijke alternatieven.",

                "Twijfel":
                    "Breng de volledige maandelijkse en jaarlijkse kost in kaart en vergelijk die met andere mobiliteitsopties.",

                "Nee":
                    "Je bent niet tevreden over de totale kost. Onderzoek goedkopere contracten of andere mobiliteitsvormen."
            }

        ],


        gezondheid: [

            {
                "Heel regelmatig":
                    "Je gebruikt deze gezondheidsdienst intensief. Behouden is logisch zolang de dienst voldoende waarde blijft bieden.",

                "Regelmatig":
                    "Je gebruikt de dienst regelmatig. Controleer of de prijs in verhouding blijft tot hoe vaak je er gebruik van maakt.",

                "Af en toe":
                    "Je gebruikt de dienst slechts af en toe. Vergelijk het abonnement met betalen per gebruik als dat mogelijk is.",

                "Bijna nooit":
                    "Je gebruikt de dienst bijna nooit. Overweeg het abonnement stop te zetten als je de inbegrepen diensten niet nodig hebt."
            },

            {
                "Ja":
                    "Je benut de inbegrepen diensten goed. Focus vooral op prijs wanneer je alternatieven vergelijkt.",

                "De meeste":
                    "Je gebruikt het grootste deel van de diensten. Controleer of een goedkoper pakket dezelfde belangrijke onderdelen bevat.",

                "Slechts enkele":
                    "Je gebruikt slechts enkele diensten. Bekijk of een kleiner of goedkoper pakket beter bij je behoefte past.",

                "Bijna geen":
                    "Je gebruikt nauwelijks de inbegrepen diensten. Overweeg een goedkoper alternatief of stopzetting."
            },

            null,

            {
                "Nee":
                    "Je hebt geen vergelijkbare diensten elders. Focus daarom vooral op de prijs-kwaliteitverhouding van deze dienst.",

                "Een paar":
                    "Controleer of er overlap bestaat tussen deze dienst en de andere gezondheidsdiensten die je gebruikt.",

                "Ja, meerdere":
                    "Je gebruikt meerdere vergelijkbare diensten. Breng de overlap in kaart en controleer of je voor dezelfde voordelen meerdere keren betaalt.",

                "Weet ik niet":
                    "Bekijk welke diensten je elders al krijgt om te controleren of er onnodige overlap bestaat."
            },

            {
                "Zeer tevreden":
                    "Je bent zeer tevreden over de prijs-kwaliteitverhouding. Behouden lijkt logisch zolang je gebruik gelijk blijft.",

                "Tevreden":
                    "Je bent tevreden. Vergelijk alleen met alternatieven die minstens dezelfde relevante diensten bieden.",

                "Twijfel":
                    "Vergelijk de kost met wat je daadwerkelijk gebruikt en bekijk of een goedkoper alternatief voldoende is.",

                "Nee":
                    "Je bent niet tevreden over de prijs-kwaliteitverhouding. Overweeg een goedkoper alternatief of stopzetting."
            }

        ],


        media: [

            {
                "Dagelijks":
                    "Je gebruikt dit media-abonnement dagelijks. Controleer vooral of je huidige abonnementsniveau niet uitgebreider is dan nodig.",

                "Enkele keren per week":
                    "Je gebruikt het abonnement regelmatig. Vergelijk met een goedkoper niveau dat dezelfde belangrijke content bevat.",

                "Af en toe":
                    "Je gebruikt het abonnement maar af en toe. Overweeg een goedkoper abonnement of tijdelijke stopzetting.",

                "Bijna nooit":
                    "Je gebruikt het media-abonnement bijna nooit. Stopzetten kan een eenvoudige besparingsmogelijkheid zijn."
            },

            null,

            {
                "Ja, heel vaak":
                    "Je gebruikt veel van de beschikbare content. Behouden kan logisch zijn zolang de prijs voor jou passend blijft.",

                "Regelmatig":
                    "Je gebruikt de content regelmatig. Controleer of een goedkoper abonnement toegang blijft geven tot wat je vooral gebruikt.",

                "Slechts een deel":
                    "Je gebruikt slechts een deel van de content. Bekijk of een kleiner of goedkoper abonnement voldoende is.",

                "Bijna nooit":
                    "Je gebruikt nauwelijks de content waarvoor je betaalt. Overweeg het abonnement te verlagen of stop te zetten."
            },

            {
                "Nee":
                    "Je hebt geen andere betaalde media-abonnementen. Focus daarom vooral op gebruik en prijs van deze dienst.",

                "1 ander":
                    "Vergelijk beide media-abonnementen en controleer of er betaalde content of functies overlappen.",

                "2 andere":
                    "Je betaalt voor meerdere media-abonnementen. Bekijk welke je het meest gebruikt en overweeg een minder gebruikt abonnement stop te zetten.",

                "3 of meer":
                    "Je hebt verschillende media-abonnementen. Overweeg ze af te wisselen in plaats van allemaal tegelijk actief te houden."
            },

            {
                "Zeker":
                    "Je vindt de prijs duidelijk gerechtvaardigd. Behouden is logisch zolang je gebruik niet sterk verandert.",

                "Waarschijnlijk wel":
                    "Je vindt de prijs waarschijnlijk gerechtvaardigd. Controleer bij een prijsstijging opnieuw of dat nog steeds zo is.",

                "Ik twijfel":
                    "Vergelijk je gebruik met de abonnementsprijs en bekijk of een goedkoper alternatief voldoende is.",

                "Nee":
                    "Je vindt de prijs niet gerechtvaardigd. Overweeg een goedkoper abonnement, alternatief of stopzetting."
            }

        ],

              ai: [

            {
                "Dagelijks":
                    "Je gebruikt deze AI-dienst dagelijks. Behouden kan logisch zijn, maar controleer of je de betaalde functies voldoende benut.",

                "Enkele keren per week":
                    "Je gebruikt de AI-dienst regelmatig. Vergelijk de betaalde versie met de gratis versie en bepaal welke functies je werkelijk nodig hebt.",

                "Af en toe":
                    "Je gebruikt de AI-dienst maar af en toe. Overweeg de gratis versie als die voldoende mogelijkheden biedt.",

                "Bijna nooit":
                    "Je gebruikt de AI-dienst bijna nooit. Overweeg het betaalde abonnement stop te zetten en de gratis versie te gebruiken."
            },

            {
                "Werk":
                    "Omdat je de AI-dienst voor werk gebruikt, beoordeel vooral welke betaalde functies daadwerkelijk tijd of werk besparen.",

                "Privé":
                    "Voor privégebruik kan een gratis versie mogelijk voldoende zijn. Vergelijk welke betaalde functies je werkelijk nodig hebt.",

                "Studie":
                    "Controleer of de gratis versie voldoende mogelijkheden biedt voor je studie voordat je voor Premium blijft betalen.",

                "Meerdere toepassingen":
                    "Je gebruikt AI voor verschillende toepassingen. Breng in kaart welke betaalde functies voor die toepassingen echt noodzakelijk zijn."
            },

            {
                "Ja, heel vaak":
                    "Je gebruikt betaalde functies intensief. Behouden lijkt logisch zolang deze functies voldoende meerwaarde bieden.",

                "Regelmatig":
                    "Je gebruikt betaalde functies regelmatig. Controleer of de waarde ervan opweegt tegen de abonnementsprijs.",

                "Bijna nooit":
                    "Je gebruikt nauwelijks functies waarvoor betaling nodig is. Probeer de gratis versie als die je belangrijkste gebruik ondersteunt.",

                "Weet ik niet":
                    "Controleer welke functies exclusief bij je betaalde abonnement horen en of je die daadwerkelijk gebruikt."
            },

            {
                "Nee":
                    "Je betaalt niet voor andere AI-diensten. Focus daarom vooral op de waarde van dit abonnement.",

                "1 andere":
                    "Vergelijk beide AI-abonnementen en controleer of functies overlappen waarvoor je dubbel betaalt.",

                "2 andere":
                    "Je betaalt voor meerdere AI-diensten. Bekijk welke dienst je werkelijk het meest gebruikt en welke functies overlappen.",

                "3 of meer":
                    "Je hebt verschillende betaalde AI-diensten. Overweeg het aantal abonnementen te verminderen en functies bij één of twee diensten te bundelen."
            },

            {
                "Waarschijnlijk wel":
                    "Je denkt dat de gratis versie voldoende is. Probeer die als alternatief voordat je opnieuw voor een betaalde periode betaalt.",

                "Misschien":
                    "Vergelijk de functies die je werkelijk gebruikt met de gratis versie om te bepalen of Premium noodzakelijk is.",

                "Waarschijnlijk niet":
                    "De gratis versie lijkt waarschijnlijk onvoldoende. Controleer wel of een goedkoper betaald niveau beschikbaar is.",

                "Zeker niet":
                    "Je hebt de betaalde functies duidelijk nodig. Focus daarom vooral op prijs en eventuele goedkopere betaalde alternatieven."
            }

        ],


        beveiliging: [

            null,

            {
                "Dagelijks":
                    "Je gebruikt of controleert de beveiligingsdienst dagelijks. Behouden kan logisch zijn zolang prijs en dienstverlening passend blijven.",

                "Regelmatig":
                    "Je gebruikt de dienst regelmatig. Vergelijk de huidige prijs met aanbieders die een vergelijkbaar beveiligingsniveau bieden.",

                "Af en toe":
                    "Je gebruikt de dienst slechts af en toe actief. Controleer vooral welke automatische beveiliging je abonnement ondertussen biedt.",

                "Bijna nooit":
                    "Je gebruikt de dienst nauwelijks actief. Controleer wel eerst welke automatische bescherming actief blijft voordat je iets wijzigt."
            },

            {
                "Ja":
                    "Professionele opvolging is inbegrepen. Vergelijk alleen met alternatieven die een vergelijkbaar niveau van opvolging bieden.",

                "Nee":
                    "Er is geen professionele opvolging inbegrepen. Vergelijk de prijs met eenvoudigere beveiligingsoplossingen zonder opvolgingsdienst.",

                "Gedeeltelijk":
                    "Controleer precies welke professionele opvolging inbegrepen is en of de meerprijs daarvoor gerechtvaardigd is.",

                "Weet ik niet":
                    "Controleer je contract om te bepalen welke professionele opvolging je precies krijgt voor de prijs die je betaalt."
            },

            {
                "Minder dan een jaar geleden":
                    "Je hebt recent vergeleken. Controleer vooral of prijs en voorwaarden sindsdien gewijzigd zijn.",

                "1 tot 2 jaar geleden":
                    "Vergelijk je beveiligingscontract opnieuw om te controleren of de huidige prijs nog competitief is.",

                "Meer dan 2 jaar geleden":
                    "Het is meer dan twee jaar geleden dat je alternatieven bekeek. Een nieuwe marktvergelijking is aangewezen.",

                "Nog nooit":
                    "Vergelijk je beveiligingsdienst met alternatieven die hetzelfde beschermingsniveau bieden."
            },

            {
                "Zeer tevreden":
                    "Je bent zeer tevreden over de prijs-kwaliteitverhouding. Behouden lijkt logisch zolang de voorwaarden gelijk blijven.",

                "Tevreden":
                    "Je bent tevreden. Controleer bij een prijsstijging opnieuw of de dienstverlening de kost blijft rechtvaardigen.",

                "Twijfel":
                    "Vergelijk prijs, dekking en dienstverlening met andere beveiligingsoplossingen.",

                "Nee":
                    "Je bent niet tevreden over de prijs-kwaliteitverhouding. Onderzoek alternatieven met een vergelijkbaar beschermingsniveau."
            }

        ],


        "wonen & huishouden": [

            null,

            {
                "Regelmatig":
                    "Je gebruikt deze dienst regelmatig. Controleer of een abonnement voordeliger blijft dan afzonderlijke interventies.",

                "Enkele keren per jaar":
                    "Vergelijk de jaarlijkse abonnementsprijs met de kost van enkele losse interventies per jaar.",

                "Zelden":
                    "Je hebt de dienst zelden nodig. Bekijk of betalen per interventie goedkoper kan zijn.",

                "Bijna nooit":
                    "Je gebruikt de dienst bijna nooit. Overweeg of een vast abonnement nog financieel zinvol is."
            },

            {
                "Ja, volledig":
                    "Onderdelen of interventies zijn volledig inbegrepen. Neem hun waarde mee wanneer je goedkopere alternatieven vergelijkt.",

                "Gedeeltelijk":
                    "Controleer welke kosten wel en niet inbegrepen zijn om de werkelijke waarde van het abonnement te bepalen.",

                "Nee":
                    "Onderdelen en interventies zijn niet inbegrepen. Vergelijk daarom de abonnementskost kritisch met betalen per gebruik.",

                "Weet ik niet":
                    "Controleer je contract om te bepalen welke interventies en onderdelen werkelijk inbegrepen zijn."
            },

            {
                "Recent":
                    "Je hebt recent alternatieven bekeken. Controleer vooral of prijzen of voorwaarden ondertussen veranderd zijn.",

                "Een tijdje geleden":
                    "Vergelijk opnieuw met andere aanbieders om te controleren of je huidige contract nog competitief is.",

                "Nog nooit":
                    "Vergelijk deze dienst voor het eerst met andere aanbieders of met betalen per interventie.",

                "Er zijn weinig alternatieven":
                    "Als er weinig alternatieven zijn, beoordeel dan vooral of het abonnement goedkoper is dan afzonderlijke interventies."
            },

            {
                "Zeker":
                    "Je vindt de kost gerechtvaardigd. Behouden lijkt logisch zolang je gebruik en voorwaarden gelijk blijven.",

                "Waarschijnlijk wel":
                    "De kost lijkt waarschijnlijk gerechtvaardigd. Controleer bij verlenging opnieuw hoeveel je de dienst werkelijk gebruikt.",

                "Ik twijfel":
                    "Bereken hoeveel de dienst je jaarlijks kost en vergelijk dat met de waarde van de interventies die je werkelijk gebruikt.",

                "Nee":
                    "Je vindt de kost niet gerechtvaardigd. Onderzoek een goedkoper alternatief of betalen per gebruik."
            }

        ],


        "hosting & websites": [

            null,

            {
                "Essentieel":
                    "De dienst is essentieel. Zoek besparing vooral binnen vergelijkbare pakketten zonder noodzakelijke functies te verliezen.",

                "Belangrijk":
                    "De dienst is belangrijk. Vergelijk goedkopere pakketten die je belangrijkste functies behouden.",

                "Handig maar niet essentieel":
                    "Controleer of een goedkoper pakket voldoende is voor een dienst die niet essentieel is.",

                "Nauwelijks belangrijk":
                    "De dienst is nauwelijks belangrijk. Overweeg downgraden of stopzetten als er geen belangrijke afhankelijkheden zijn."
            },

            {
                "Ja":
                    "Je gebruikt de inbegrepen functies goed. Vergelijk vooral prijs en prestaties met soortgelijke pakketten.",

                "De meeste":
                    "Je gebruikt de meeste functies. Controleer of een goedkoper pakket dezelfde belangrijke mogelijkheden biedt.",

                "Slechts enkele":
                    "Je gebruikt slechts enkele functies. Bekijk of een eenvoudiger en goedkoper pakket voldoende is.",

                "Bijna geen":
                    "Je gebruikt nauwelijks de inbegrepen functies. Overweeg een kleiner pakket of eenvoudiger alternatief."
            },

            {
                "Ja, recent":
                    "Je hebt recent prijzen vergeleken. Controleer vooral of je huidige aanbieder zijn prijs of voorwaarden gewijzigd heeft.",

                "Minder dan een jaar geleden":
                    "Je vergelijking is nog relatief recent. Controleer opnieuw bij de volgende verlenging.",

                "Meer dan een jaar geleden":
                    "Vergelijk hostingprijzen en voorwaarden opnieuw omdat je laatste vergelijking meer dan een jaar geleden was.",

                "Nog nooit":
                    "Vergelijk je huidige hosting- of websitepakket met andere aanbieders met vergelijkbare specificaties."
            },

            {
                "Waarschijnlijk wel":
                    "Je denkt dat een goedkoper pakket voldoende is. Vergelijk de eerstvolgende goedkopere formule met je werkelijke gebruik.",

                "Misschien":
                    "Controleer welke resources en functies je werkelijk gebruikt voordat je beslist of je kunt downgraden.",

                "Waarschijnlijk niet":
                    "Een goedkoper pakket lijkt mogelijk onvoldoende. Zoek eerder naar een voordeligere aanbieder met vergelijkbare mogelijkheden.",

                "Zeker niet":
                    "Je huidige pakketniveau lijkt noodzakelijk. Focus op prijsvergelijking zonder capaciteit of belangrijke functies te verminderen."
            }

        ],


        "maaltijden & bezorging": [

            {
                "Meerdere keren per week":
                    "Je gebruikt deze dienst intensief. Controleer of het abonnement werkelijk voordeel geeft ten opzichte van afzonderlijke bestellingen.",

                "Ongeveer wekelijks":
                    "Bereken of je wekelijkse gebruik voldoende voordeel oplevert om de abonnementsprijs te rechtvaardigen.",

                "Enkele keren per maand":
                    "Vergelijk je abonnementskost met wat je zonder abonnement voor enkele bestellingen per maand zou betalen.",

                "Bijna nooit":
                    "Je gebruikt de dienst bijna nooit. Overweeg het abonnement stop te zetten en alleen per bestelling te betalen."
            },

            null,

            {
                "Nooit":
                    "Je verspilt geen bestellingen of tegoeden. Focus daarom vooral op de totale prijs tegenover je werkelijke gebruik.",

                "Soms":
                    "Je laat soms tegoeden of bestellingen ongebruikt. Bereken hoeveel waarde daardoor jaarlijks verloren gaat.",

                "Regelmatig":
                    "Je hebt regelmatig ongebruikte tegoeden. Overweeg een flexibelere formule zonder vaste verplichtingen.",

                "Heel vaak":
                    "Je betaalt vaak voor ongebruikte tegoeden of bestellingen. Stopzetten of overstappen naar betalen per gebruik kan voordeliger zijn."
            },

            {
                "Nee":
                    "Je gebruikt geen vergelijkbare diensten. Focus daarom vooral op de waarde van dit abonnement.",

                "1 andere":
                    "Vergelijk beide diensten en controleer of je voor overlappende voordelen of bezorgkortingen betaalt.",

                "2 andere":
                    "Je gebruikt meerdere vergelijkbare diensten. Bekijk welke je werkelijk het meest gebruikt en schrap onnodige overlap.",

                "3 of meer":
                    "Je gebruikt verschillende maaltijd- of bezorgdiensten. Beperk betaalde abonnementen tot de diensten die je daadwerkelijk vaak gebruikt."
            },

            {
                "Absoluut":
                    "Je ervaart duidelijke waarde. Behouden kan logisch zijn zolang het gebruik hoog blijft.",

                "Waarschijnlijk wel":
                    "De dienst lijkt voldoende waarde te bieden. Controleer regelmatig of je gebruik de abonnementsprijs blijft rechtvaardigen.",

                "Ik twijfel":
                    "Vergelijk je jaarlijkse abonnementsprijs met de concrete kortingen of voordelen die je werkelijk ontvangt.",

                "Nee":
                    "Je vindt dat de dienst onvoldoende waarde biedt. Stopzetten is dan een directe besparingsmogelijkheid."
            }

        ],


        "boeken & lezen": [

            {
                "Dagelijks":
                    "Je gebruikt deze dienst dagelijks. Behouden kan voordelig zijn zolang je voldoende boeken of luistercontent gebruikt.",

                "Enkele keren per week":
                    "Je gebruikt de dienst regelmatig. Vergelijk je abonnementsprijs met de kost van de boeken die je anders afzonderlijk zou kopen.",

                "Af en toe":
                    "Je gebruikt de dienst slechts af en toe. Controleer of losse aankopen goedkoper zouden zijn.",

                "Bijna nooit":
                    "Je gebruikt de dienst bijna nooit. Overweeg het abonnement stop te zetten en boeken afzonderlijk te kopen wanneer nodig."
            },

            null,

            {
                "Zeker":
                    "Je benut het abonnement voldoende. Behouden lijkt logisch zolang je lees- of luistergedrag gelijk blijft.",

                "Waarschijnlijk wel":
                    "Je benut het abonnement waarschijnlijk voldoende. Vergelijk voor zekerheid je jaarlijkse kost met losse aankopen.",

                "Ik twijfel":
                    "Bereken hoeveel boeken je werkelijk leest of beluistert en vergelijk dat met je jaarlijkse abonnementsprijs.",

                "Nee":
                    "Je gebruikt de dienst onvoldoende. Losse aankopen of een goedkoper alternatief kunnen voordeliger zijn."
            },

            {
                "Nee":
                    "Je betaalt niet voor andere leesdiensten. Focus daarom vooral op het gebruik van dit abonnement.",

                "1 andere":
                    "Vergelijk beide lees- of luisterdiensten en controleer of de catalogussen of voordelen sterk overlappen.",

                "2 andere":
                    "Je betaalt voor meerdere leesdiensten. Overweeg één primaire dienst te behouden.",

                "3 of meer":
                    "Je hebt verschillende betaalde lees- of luisterdiensten. Verminder overlap door alleen de diensten te behouden die je werkelijk gebruikt."
            },

            {
                "Waarschijnlijk wel":
                    "Je denkt dat losse boeken voordeliger zijn. Vergelijk je gemiddelde maandelijkse leesvolume met de abonnementsprijs.",

                "Misschien":
                    "Bereken de kost van je werkelijke lees- of luistergedrag met losse aankopen voordat je verlengt.",

                "Waarschijnlijk niet":
                    "Het abonnement lijkt waarschijnlijk voordeliger dan losse aankopen. Behouden kan daarom financieel interessant zijn.",

                "Zeker niet":
                    "Je bent ervan overtuigd dat het abonnement voordeliger is. Focus vooral op voldoende gebruik."
            }

        ],


        water: [

            null,

            {
                "Laag":
                    "Je waterverbruik is laag. Grote besparingen via gedragsverandering zijn mogelijk beperkt, maar blijf je verbruik opvolgen.",

                "Gemiddeld":
                    "Volg je waterverbruik regelmatig op en vergelijk het met eerdere periodes om ongewone stijgingen snel te herkennen.",

                "Hoog":
                    "Je waterverbruik is hoog. Zoek naar de grootste verbruiksposten en controleer of gerichte besparingsmaatregelen mogelijk zijn.",

                "Weet ik niet":
                    "Bekijk je waterfactuur of meterstanden om eerst zicht te krijgen op je werkelijke verbruik."
            },

            {
                "Ja, regelmatig":
                    "Je volgt je waterverbruik al actief op. Let vooral op onverwachte stijgingen die op extra verbruik of een lek kunnen wijzen.",

                "Soms":
                    "Volg je meterstand vaker op zodat je sneller merkt wanneer je waterverbruik stijgt.",

                "Bijna nooit":
                    "Controleer je waterverbruik regelmatiger om besparingsmogelijkheden en onverwachte stijgingen te herkennen.",

                "Nooit":
                    "Begin je waterverbruik periodiek te registreren zodat je weet waar mogelijke besparingen zitten."
            },

            {
                "Ja, meerdere":
                    "Je hebt al meerdere waterbesparende maatregelen. Focus vooral op het opvolgen van het effect ervan op je verbruik.",

                "Een paar":
                    "Je hebt al enkele maatregelen. Bekijk of bijkomende eenvoudige waterbesparende oplossingen zinvol zijn.",

                "Nee":
                    "Overweeg eenvoudige waterbesparende maatregelen op plaatsen waar je het meeste water gebruikt.",

                "Weet ik niet":
                    "Controleer welke waterbesparende voorzieningen al aanwezig zijn voordat je nieuwe maatregelen overweegt."
            },

            null

        ],


        overig: [

            {
                "Heel vaak":
                    "Je gebruikt dit contract intensief. Behouden kan logisch zijn zolang prijs en voorwaarden passend blijven.",

                "Regelmatig":
                    "Je gebruikt het contract regelmatig. Controleer of de kost in verhouding staat tot het gebruik.",

                "Af en toe":
                    "Je gebruikt het contract slechts af en toe. Vergelijk de vaste kost met goedkopere of flexibelere alternatieven.",

                "Bijna nooit":
                    "Je gebruikt het contract bijna nooit. Overweeg stopzetting als er geen andere belangrijke voordelen aan verbonden zijn."
            },

            {
                "Zeker":
                    "Je vindt dat je voldoende waarde krijgt. Behouden lijkt logisch zolang prijs en voorwaarden niet verslechteren.",

                "Waarschijnlijk wel":
                    "Je krijgt waarschijnlijk voldoende waarde. Controleer bij verlenging opnieuw of dat nog steeds zo is.",

                "Ik twijfel":
                    "Vergelijk de totale kost met wat je werkelijk uit het contract haalt voordat je opnieuw verlengt.",

                "Nee":
                    "Je vindt dat je onvoldoende waarde krijgt. Onderzoek een goedkoper alternatief of stopzetting."
            },

            {
                "Ja":
                    "Je kent de eind- of verlengdatum. Plan vóór die datum een nieuwe beoordeling van prijs en voorwaarden.",

                "Ongeveer":
                    "Zoek de exacte eind- of verlengdatum op zodat je tijdig alternatieven kunt bekijken.",

                "Nee":
                    "Controleer wanneer het contract eindigt of verlengd wordt en welke opzegtermijn van toepassing is.",

                "Niet van toepassing":
                    "Er is geen klassieke einddatum. Controleer daarom welke voorwaarden gelden wanneer je wilt wijzigen of stopzetten."
            },

            {
                "Recent":
                    "Je hebt recent alternatieven bekeken. Controleer vooral of prijzen of voorwaarden ondertussen veranderd zijn.",

                "Een tijdje geleden":
                    "Vergelijk opnieuw met alternatieven om te controleren of je huidige contract nog competitief is.",

                "Nog nooit":
                    "Bekijk beschikbare alternatieven om voor het eerst te beoordelen hoe je huidige contract zich verhoudt tot andere opties.",

                "Er zijn geen alternatieven":
                    "Als er geen duidelijke alternatieven zijn, focus dan op het optimaliseren van prijs, voorwaarden of gebruik binnen je huidige contract."
            },

            {
                "Lagere prijs":
                    "Focus bij een volgende vergelijking op een lagere totale kost zonder belangrijke voordelen te verliezen.",

                "Betere voorwaarden":
                    "Vergelijk contracten vooral op voorwaarden zoals looptijd, opzegging en inbegrepen diensten.",

                "Meer flexibiliteit":
                    "Zoek naar een contract met kortere looptijd of flexibelere wijzigings- en opzegmogelijkheden.",

                "Ik ben tevreden":
                    "Je bent tevreden met het contract. Behouden is logisch zolang prijs, voorwaarden en gebruik stabiel blijven."
            }

        ]  

    };


    const categoryActions =
        actions[category];

    if (!categoryActions) {
        return null;
    }


    const questionActions =
        categoryActions[index];

    if (!questionActions) {
        return null;
    }


    return questionActions[answer] || null;

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
    "Bekijk waar je jouw contract nog kunt optimaliseren en mogelijk besparen.";

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

                const planContract =
            document.getElementById("ckaiPlanContract");

        const planMonthly =
            document.getElementById("ckaiPlanMonthly");

        const planYearly =
            document.getElementById("ckaiPlanYearly");


        if (ckaiCurrentContract) {

            if (planContract) {
                planContract.textContent =
                    ckaiCurrentContract.name;
            }

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

                case "once":
                    monthlyCost = 0;
                    yearlyCost = amount;
                    break;

            }

            if (planMonthly) {
                planMonthly.textContent =
                    ContractService.formatPrice(monthlyCost);
            }

            if (planYearly) {
                planYearly.textContent =
                    ContractService.formatPrice(yearlyCost);
            }

        }

        document
            .getElementById("ckaiAdviceScreen")
            ?.classList.add("hidden");

        document
    .getElementById("ckaiPremiumPlanScreen")
    ?.classList.remove("hidden");


        // Premium altijd bovenaan openen
        const ckaiPage =
            document.getElementById("page-ckai");

        if (ckaiPage) {
            ckaiPage.scrollTop = 0;
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    };

}

const openPremiumButton =
    document.getElementById("openPremium");

if (openPremiumButton) {

    openPremiumButton.onclick = () => {

        const ckaiHome =
            document.querySelector(".ckai-hero");

        const premiumScreen =
            document.getElementById("ckaiPremiumScreen");

        if (ckaiHome) {
            ckaiHome.style.display = "none";
        }

        if (premiumScreen) {
            premiumScreen.classList.remove("hidden");
            premiumScreen.style.display = "block";
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    };

}

const premiumLaterButton =
    document.getElementById("premiumLater");

if (premiumLaterButton) {

    premiumLaterButton.onclick =
        closeCKAIPremium;

}

/* ==========================================================
   CK AI - OPEN PREMIUM BESPAARPLAN
========================================================== */

const startPremiumButton =
    document.getElementById("startPremium");

if (startPremiumButton) {

    startPremiumButton.onclick = () => {

        const planContract =
    document.getElementById("ckaiPlanContract");

const planMonthly =
    document.getElementById("ckaiPlanMonthly");

const planYearly =
    document.getElementById("ckaiPlanYearly");


if (ckaiCurrentContract) {

    if (planContract) {
        planContract.textContent =
            ckaiCurrentContract.name;
    }

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

    if (planMonthly) {
        planMonthly.textContent =
            ContractService.formatPrice(monthlyCost);
    }

    if (planYearly) {
        planYearly.textContent =
            ContractService.formatPrice(yearlyCost);
    }

}

/* ===========================
   PREMIUM AANBEVOLEN ACTIE
=========================== */

const planActionTitle =
    document.getElementById("ckaiPlanActionTitle");

const planActionText =
    document.getElementById("ckaiPlanActionText");

if (
    ckaiEvaluationResult &&
    planActionTitle &&
    planActionText
) {

    switch (ckaiEvaluationResult.status) {

        case "behouden":

            planActionTitle.textContent =
                "Contract behouden";

            planActionText.textContent =
                "Dit contract sluit goed aan bij je huidige gebruik. CK AI ziet momenteel geen sterke reden om het contract te wijzigen.";

            break;


        case "optimaliseren":

            planActionTitle.textContent =
                "Contract optimaliseren";

            planActionText.textContent =
                "Je contract biedt voldoende waarde, maar op basis van je antwoorden zijn er mogelijkheden om je abonnement beter af te stemmen op je gebruik.";

            break;


        case "herbekijken":

            planActionTitle.textContent =
                "Contract herbekijken";

            planActionText.textContent =
                "Op basis van je antwoorden is het verstandig om te controleren of dit contract nog de beste keuze is voor jouw huidige gebruik.";

            break;


        case "opzeggen":

            planActionTitle.textContent =
                "Opzeggen overwegen";

            planActionText.textContent =
                "Je antwoorden wijzen erop dat je momenteel weinig waarde uit dit contract haalt. Overweeg daarom of je het contract nog wilt behouden.";

            break;

    }

}

/* ===========================
   PREMIUM PERSOONLIJKE ACTIEPUNTEN
=========================== */

const planActions =
    document.getElementById("ckaiPlanActions");

if (
    planActions &&
    ckaiCurrentContract
) {

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

    const actionInsights = [];

    ckaiQuestions.forEach((question, index) => {

        const answer =
            answers[index];

        if (!answer) return;

        const action =
    getCKAIAction(
        analysisKey,
        index,
        answer
    );

if (!action) return;

const answerScore =
    scoring?.[index]?.[answer];

actionInsights.push({
    text: action,
    score:
        typeof answerScore === "number"
            ? Math.abs(answerScore)
            : 0
});

    });


    actionInsights.sort(
        (a, b) => b.score - a.score
    );


    const strongestActions =
        actionInsights.slice(0, 3);


    if (strongestActions.length) {

        planActions.innerHTML =
            strongestActions
                .map(item => `
                    <div class="ckai-plan-action">
                        ${item.text}
                    </div>
                `)
                .join("");

    }

}

        document
            .getElementById("ckaiPremiumScreen")
            ?.classList.add("hidden");

        document
            .getElementById("ckaiPremiumPlanScreen")
            ?.classList.remove("hidden");

        const ckaiPage =
            document.getElementById("page-ckai");

        if (ckaiPage) {
            ckaiPage.scrollTop = 0;
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    };

}


/* ==========================================================
   CK AI - SLUIT PREMIUM BESPAARPLAN
========================================================== */

const closePremiumPlanButton =
    document.getElementById("closePremiumPlan");

if (closePremiumPlanButton) {

    closePremiumPlanButton.onclick = () => {

        document
            .getElementById("ckaiPremiumPlanScreen")
            ?.classList.add("hidden");

        document
            .getElementById("ckaiAdviceScreen")
            ?.classList.remove("hidden");

        const ckaiPage =
            document.getElementById("page-ckai");

        if (ckaiPage) {
            ckaiPage.scrollTop = 0;
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

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