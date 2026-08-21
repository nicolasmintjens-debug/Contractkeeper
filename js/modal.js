/* ==========================================================
   ContractKeeper
   modal.js
========================================================== */

let editingContractId = null;
let selectedContract = null;

function updateTelecomPackVisibility() {

    const categorySelect =
        document.getElementById("category");

    const telecomPackGroup =
        document.getElementById("telecomPackGroup");

    const energyDetailsGroup =
        document.getElementById("energyDetailsGroup");

    const energyType =
        document.getElementById("energyType");

    const electricityUsageGroup =
        document.getElementById("electricityUsageGroup");

    const gasUsageGroup =
        document.getElementById("gasUsageGroup");

    const electricityPriceGroup =
        document.getElementById("electricityPriceGroup");

    const gasPriceGroup =
        document.getElementById("gasPriceGroup");

    const solarPanelsGroup =
        document.getElementById("solarPanelsGroup");

    const hasSolarPanels =
        document.getElementById("hasSolarPanels");

    const solarInjectionGroup =
        document.getElementById("solarInjectionGroup");

    const solarInjectionPriceGroup =
        document.getElementById("solarInjectionPriceGroup");

    if (!categorySelect) {
        return;
    }


    // TELECOM

    if (telecomPackGroup) {

        telecomPackGroup.style.display =
            categorySelect.value === "Telecom"
                ? "block"
                : "none";

    }


    // ENERGIE

    const isEnergy =
        categorySelect.value === "Energie";

    if (energyDetailsGroup) {

        energyDetailsGroup.style.display =
            isEnergy
                ? "block"
                : "none";

    }


    // ELEKTRICITEIT / GAS

    if (energyType) {

        const type =
            energyType.value;

        const hasElectricity =
            type === "Elektriciteit" ||
            type === "Elektriciteit + gas";

        const hasGas =
            type === "Gas" ||
            type === "Elektriciteit + gas";


        if (electricityUsageGroup) {

            electricityUsageGroup.style.display =
                isEnergy && hasElectricity
                    ? "block"
                    : "none";

        }


        if (gasUsageGroup) {

            gasUsageGroup.style.display =
                isEnergy && hasGas
                    ? "block"
                    : "none";

        }


        if (electricityPriceGroup) {

            electricityPriceGroup.style.display =
                isEnergy && hasElectricity
                    ? "block"
                    : "none";

        }


        if (gasPriceGroup) {

            gasPriceGroup.style.display =
                isEnergy && hasGas
                    ? "block"
                    : "none";

        }


        if (solarPanelsGroup) {

            solarPanelsGroup.style.display =
                isEnergy && hasElectricity
                    ? "block"
                    : "none";

        }


        if (solarInjectionGroup) {

            solarInjectionGroup.style.display =
                isEnergy &&
                hasElectricity &&
                hasSolarPanels?.value === "Ja"
                    ? "block"
                    : "none";

        }


        if (solarInjectionPriceGroup) {

            solarInjectionPriceGroup.style.display =
                isEnergy &&
                hasElectricity &&
                hasSolarPanels?.value === "Ja"
                    ? "block"
                    : "none";

        }

    }

}   

/* ==========================================================
   INITIALISATIE
========================================================== */

function initModal() {

    const addModal =
        document.getElementById("addContractModal");

    const openButton =
        document.getElementById("addContract");

    const closeButton =
        document.getElementById("closeModal");

    const closeDetailButton =
        document.getElementById("closeDetailModal");

    const form =
        document.getElementById("contractForm");

    const categorySelect =
        document.getElementById("category");

    const energyType =
        document.getElementById("energyType"); 
        
    const hasSolarPanels =
    document.getElementById("hasSolarPanels");    

    const telecomPackGroup =
        document.getElementById("telecomPackGroup");


    if (openButton) {

        openButton.addEventListener(
            "click",
            openAddModal
        );

    }


   if (categorySelect) {

    categorySelect.addEventListener(
        "change",
        updateTelecomPackVisibility
    );

    updateTelecomPackVisibility();

}

if (energyType) {

    energyType.addEventListener(
        "change",
        updateTelecomPackVisibility
    );

}

if (hasSolarPanels) {

    hasSolarPanels.addEventListener(
        "change",
        updateTelecomPackVisibility
    );

}

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }

    if (closeDetailButton) {

        closeDetailButton.addEventListener(
            "click",
            closeDetailModal
        );

    }

    if (form) {

        form.addEventListener(
            "submit",
            saveContract
        );

    }

    if (addModal) {

        addModal.addEventListener("click", event => {

            if (event.target === addModal) {

                closeModal();

            }

        });

    }

    initAutocomplete();

    initDetailButtons();

}


/* ==========================================================
   MODAL OPENEN
========================================================== */

function showModal() {

    document
        .getElementById("addContractModal")
        ?.classList.add("show");

}


/* ==========================================================
   MODAL SLUITEN
========================================================== */

function closeModal() {

    document
        .getElementById("addContractModal")
        ?.classList.remove("show");

    resetForm();

}


/* ==========================================================
   DETAILMODAL SLUITEN
========================================================== */

function closeDetailModal() {

    document
        .getElementById("contractDetailModal")
        ?.classList.remove("show");

}


/* ==========================================================
   NIEUW CONTRACT
========================================================== */

function openAddModal() {

    editingContractId = null;

    resetForm();

    setModalTitle("Nieuw contract");

    document.getElementById(
        "saveContractButton"
    ).innerHTML = `
        <i class="bi bi-check-lg"></i>
        Contract opslaan
    `;

    showModal();

}


/* ==========================================================
   CONTRACT BEWERKEN
========================================================== */

function openEditModal(id) {

    const contract =
        ContractService.getById(id);

    if (!contract) return;

    editingContractId = id;

    fillForm(contract);

    setModalTitle("Contract bewerken");

    document.getElementById(
        "saveContractButton"
    ).innerHTML = `
        <i class="bi bi-check-lg"></i>
        Wijzigingen opslaan
    `;

    showModal();

}

/* ==========================================================
   OPSLAAN
========================================================== */

function saveContract(event) {

    event.preventDefault();

    const contract = readForm();

    if (!validate(contract)) {
        return;
    }

    if (editingContractId) {

        ContractService.update(
            editingContractId,
            contract
        );

        showToast("Contract bijgewerkt");

    } else {

    ContractService.add(contract);

    const contracts =
        ContractService.getAll();

    const realContracts =
        contracts.filter(
            item => item.isDemo !== true
        );

    const demoContracts =
        contracts.filter(
            item => item.isDemo === true
        );

    if (
        realContracts.length === 1 &&
        demoContracts.length > 0
    ) {

        const cleanedContracts =
            contracts.filter(
                item => item.isDemo !== true
            );

        Storage.saveContracts(
            cleanedContracts
        );

    }

    showToast("Contract toegevoegd");

}

    closeModal();

    renderContracts();

    updateDashboard();

}


/* ==========================================================
   FORM UITLEZEN
========================================================== */

function readForm() {

    const category =
        value("category");

    return {

        name: value("name"),

        category: category,

        telecomPack:
            category === "Telecom"
                ? value("telecomPack")
                : "",

        energyType:
            category === "Energie"
                ? value("energyType")
                : "",

        energyTariffType:
            category === "Energie"
                ? value("energyTariffType")
                : "",

        energyProductName:
            category === "Energie"
                ? value("energyProductName")
                : "",

        energyMeterType:
    category === "Energie"
        ? value("energyMeterType")
        : "",

hasDigitalMeter:
    category === "Energie"
        ? value("hasDigitalMeter")
        : "",        

        electricityYearUsage:
            category === "Energie"
                ? Number(value("electricityYearUsage")) || 0
                : 0,

        gasYearUsage:
    category === "Energie"
        ? Number(value("gasYearUsage")) || 0
        : 0,

hasSolarPanels:
    category === "Energie"
        ? value("hasSolarPanels")
        : "",

solarInjectionYear:
    category === "Energie" &&
    value("hasSolarPanels") === "Ja"
        ? Number(value("solarInjectionYear")) || 0
        : 0,

solarInjectionPrice:
    category === "Energie" &&
    value("hasSolarPanels") === "Ja"
        ? Number(value("solarInjectionPrice")) || 0
        : 0,

electricityPrice:
    category === "Energie"
        ? Number(value("electricityPrice")) || 0
        : 0,

gasPrice:
    category === "Energie"
        ? Number(value("gasPrice")) || 0
        : 0,

energyFixedFee:
    category === "Energie"
        ? Number(value("energyFixedFee")) || 0
        : 0,        

frequency: value("frequency"),

        amount: Number(value("amount")),

        endDate: value("endDate"),

        notes: value("notes")

    };

}


/* ==========================================================
   FORM INVULLEN
========================================================== */

function fillForm(contract) {

    setValue("name", contract.name);
    setValue("category", contract.category);

    setValue(
        "telecomPack",
        contract.telecomPack || "Alleen internet"
    );

    setValue(
        "energyType",
        contract.energyType || "Elektriciteit"
    );

    setValue(
        "energyTariffType",
        contract.energyTariffType || "Vast"
    );

    setValue(
        "energyProductName",
        contract.energyProductName || ""
    );

    setValue(
        "electricityYearUsage",
        contract.electricityYearUsage || ""
    );

    setValue(
    "energyMeterType",
    contract.energyMeterType || "Enkelvoudig"
);

setValue(
    "hasDigitalMeter",
    contract.hasDigitalMeter || "Ja"
);

    setValue(
    "gasYearUsage",
    contract.gasYearUsage || ""
);

setValue(
    "hasSolarPanels",
    contract.hasSolarPanels || "Nee"
);

setValue(
    "solarInjectionYear",
    contract.solarInjectionYear || ""
);

setValue(
    "electricityPrice",
    contract.electricityPrice || ""
);

setValue(
    "gasPrice",
    contract.gasPrice || ""
);

setValue(
    "energyFixedFee",
    contract.energyFixedFee || ""
);

setValue(
    "solarInjectionPrice",
    contract.solarInjectionPrice || ""
);

updateTelecomPackVisibility();

    setValue("frequency", contract.frequency);
    setValue("amount", contract.amount);
    setValue("endDate", contract.endDate);
    setValue("notes", contract.notes);

}   


/* ==========================================================
   RESET
========================================================== */

function resetForm() {

    editingContractId = null;

    document.getElementById("contractForm")?.reset();

updateTelecomPackVisibility();

    const preview =
        document.getElementById("nameLogoPreview");

    const image =
        document.getElementById("nameLogoImage");

    if (preview) {
        preview.style.display = "none";
    }

    if (image) {
        image.removeAttribute("src");
    }

}


/* ==========================================================
   VALIDATIE
========================================================== */

function validate(contract) {

    if (!contract.name.trim()) {

        alert("Geef een naam op.");

        return false;

    }

    if (contract.amount < 0) {

        alert("Bedrag is ongeldig.");

        return false;

    }

    return true;

}

/* ==========================================================
   DETAILMODAL
========================================================== */

function showDetailModal(contract) {

    selectedContract = contract;

    const modal =
        document.getElementById("contractDetailModal");

    if (!modal) return;

    const compareEnergyBtn =
    document.getElementById("compareEnergyBtn");

if (compareEnergyBtn) {

    compareEnergyBtn.style.display =
        contract.category &&
        contract.category.toLowerCase() === "energie"
            ? "flex"
            : "none";

}

    document.getElementById("detailName").textContent =
        contract.name;

    document.getElementById("detailPrice").textContent =
        ContractService.formatPrice(contract.amount);

    document.getElementById("detailFrequency").textContent =
        translateFrequency(contract.frequency);

    document.getElementById("detailCategory").textContent =
        contract.category || "-";

    document.getElementById("detailEndDate").textContent =
        contract.endDate
            ? ContractService.formatDate(contract.endDate)
            : "-";

    const detailEnergyGroup =
    document.getElementById("detailEnergyGroup");

const detailElectricityUsageRow =
    document.getElementById("detailElectricityUsageRow");

const detailGasUsageRow =
    document.getElementById("detailGasUsageRow");

if (
    contract.category === "Energie" &&
    detailEnergyGroup
) {

    detailEnergyGroup.style.display = "block";

    document.getElementById("detailEnergyType").textContent =
        contract.energyType || "-";

    document.getElementById("detailEnergyTariffType").textContent =
        contract.energyTariffType || "-";

    document.getElementById("detailEnergyProductName").textContent =
        contract.energyProductName || "-";

    document.getElementById("detailElectricityUsage").textContent =
        contract.electricityYearUsage
            ? `${contract.electricityYearUsage} kWh`
            : "-";

    document.getElementById("detailGasUsage").textContent =
        contract.gasYearUsage
            ? `${contract.gasYearUsage} kWh`
            : "-";

    const detailSolarPanelsRow =
    document.getElementById("detailSolarPanelsRow");

const detailSolarInjectionRow =
    document.getElementById("detailSolarInjectionRow");


// ZONNEPANELEN

if (detailSolarPanelsRow) {

    const hasElectricity =
        contract.energyType === "Elektriciteit" ||
        contract.energyType === "Elektriciteit + gas";

    detailSolarPanelsRow.style.display =
        hasElectricity
            ? "flex"
            : "none";

    document.getElementById("detailSolarPanels").textContent =
        contract.hasSolarPanels || "Nee";

}


// INJECTIE

if (detailSolarInjectionRow) {

    detailSolarInjectionRow.style.display =
        contract.hasSolarPanels === "Ja"
            ? "flex"
            : "none";

    document.getElementById("detailSolarInjection").textContent =
        contract.solarInjectionYear
            ? `${contract.solarInjectionYear} kWh`
            : "-";      

}        

const detailElectricityPriceRow =
    document.getElementById("detailElectricityPriceRow");

const detailGasPriceRow =
    document.getElementById("detailGasPriceRow");


// ELEKTRICITEITSPRIJS

if (detailElectricityPriceRow) {

    const hasElectricity =
        contract.energyType === "Elektriciteit" ||
        contract.energyType === "Elektriciteit + gas";

    detailElectricityPriceRow.style.display =
        hasElectricity
            ? "flex"
            : "none";

    document.getElementById("detailElectricityPrice").textContent =
        contract.electricityPrice
            ? `€ ${Number(contract.electricityPrice).toFixed(4).replace(".", ",")} / kWh`
            : "-";

}


// GASPRIJS

if (detailGasPriceRow) {

    const hasGas =
        contract.energyType === "Gas" ||
        contract.energyType === "Elektriciteit + gas";

    detailGasPriceRow.style.display =
        hasGas
            ? "flex"
            : "none";

    document.getElementById("detailGasPrice").textContent =
        contract.gasPrice
            ? `€ ${Number(contract.gasPrice).toFixed(4).replace(".", ",")} / kWh`
            : "-";

}


// VASTE VERGOEDING

document.getElementById("detailEnergyFixedFee").textContent =
    contract.energyFixedFee
        ? `€ ${Number(contract.energyFixedFee).toFixed(2).replace(".", ",")} / jaar`
        : "-";

// GESCHATTE JAARLIJKSE ENERGIEKOST

const estimatedElement =
    document.getElementById("detailEstimatedEnergyCost");

if (estimatedElement) {

    let estimatedEnergyCost = 0;

    const electricityUsage =
        Number(contract.electricityYearUsage) || 0;

    const gasUsage =
        Number(contract.gasYearUsage) || 0;

    const electricityPrice =
        Number(contract.electricityPrice) || 0;

    const gasPrice =
        Number(contract.gasPrice) || 0;

    const fixedFee =
        Number(contract.energyFixedFee) || 0;

    const solarInjection =
        Number(contract.solarInjectionYear) || 0;

    const solarInjectionPrice =
        Number(contract.solarInjectionPrice) || 0;


    estimatedEnergyCost +=
        electricityUsage * electricityPrice;

    estimatedEnergyCost +=
        gasUsage * gasPrice;

    estimatedEnergyCost +=
        fixedFee;


    if (
        contract.hasSolarPanels === "Ja" &&
        solarInjection > 0 &&
        solarInjectionPrice > 0
    ) {

        estimatedEnergyCost -=
            solarInjection * solarInjectionPrice;

    }


    estimatedElement.textContent =
        new Intl.NumberFormat(
            "nl-BE",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(
            Math.max(estimatedEnergyCost, 0)
        ) + " / jaar";

}        

    if (detailElectricityUsageRow) {

        detailElectricityUsageRow.style.display =
            contract.energyType === "Elektriciteit" ||
            contract.energyType === "Elektriciteit + gas"
                ? "flex"
                : "none";

    }

    if (detailGasUsageRow) {

        detailGasUsageRow.style.display =
            contract.energyType === "Gas" ||
            contract.energyType === "Elektriciteit + gas"
                ? "flex"
                : "none";

    }

} else if (detailEnergyGroup) {

    detailEnergyGroup.style.display = "none";

}        

    const logo =
        ContractService.getLogo(contract.name);

    const icon =
        ContractService.getCategoryIcon(contract.category);

    document.getElementById("detailHeroIcon").innerHTML = logo

        ? `<img src="${resolveLogoSrc(logo)}"
               class="contract-logo"
               alt="${contract.name}">`

        : `<i class="bi ${icon}"></i>`;

    const status =
        ContractService.getStatus(contract);

    const badge =
        document.getElementById("detailStatus");

    badge.className = "detail-hero-status";

    switch (status) {

        case "ending":

            badge.classList.add("warning");

            badge.textContent =
                "Eindigt binnenkort";

            break;

        case "expired":

            badge.classList.add("danger");

            badge.textContent =
                "Verlopen";

            break;

        default:

            badge.classList.add("active");

            badge.textContent =
                "Actief";

    }

    const websiteRow =
    document.getElementById("detailWebsiteRow");

const websiteLink =
    document.getElementById("detailWebsite");

const service =
    ContractService.findServices(contract.name)
        ?.find(item =>
            item.name.toLowerCase() ===
            contract.name.toLowerCase()
        );

if (
    websiteRow &&
    websiteLink &&
    service?.domain
) {

    websiteLink.href =
        `https://${service.domain}`;

    websiteRow.style.display = "flex";

} else if (websiteRow) {

    websiteRow.style.display = "none";

}

    modal.classList.add("show");

}

/* ==========================================================
   ENERGIE VERGELIJKEN
========================================================== */

function openEnergyComparison(contract) {

    const postalCode =
        localStorage.getItem("energyPostalCode") || "";

    const electricityUsage =
        Number(contract.electricityYearUsage) || 0;

    const gasUsage =
        Number(contract.gasYearUsage) || 0;

    const hasSolarPanels =
        contract.hasSolarPanels || "Nee";

    const solarInjection =
        Number(contract.solarInjectionYear) || 0;

    const meterType =
        contract.energyMeterType || "";

    const digitalMeter =
        contract.hasDigitalMeter || "";


    // Controleren of postcode gekend is

    if (!postalCode) {

        alert(
            "Vul eerst je postcode in bij Instellingen → Woninggegevens."
        );

        return;

    }


    // Vergelijkingsgegevens tonen

    let summary =
        `ContractKeeper heeft deze gegevens klaar voor de vergelijking:\n\n`;

    summary +=
        `Postcode: ${postalCode}\n`;

    if (electricityUsage > 0) {

        summary +=
            `Elektriciteit: ${electricityUsage.toLocaleString("nl-BE")} kWh/jaar\n`;

    }

    if (gasUsage > 0) {

        summary +=
            `Gas: ${gasUsage.toLocaleString("nl-BE")} kWh/jaar\n`;

    }

    if (meterType) {

        summary +=
            `Metertype: ${meterType}\n`;

    }

    if (digitalMeter) {

        summary +=
            `Digitale meter: ${digitalMeter}\n`;

    }

    summary +=
        `Zonnepanelen: ${hasSolarPanels}\n`;

    if (
        hasSolarPanels === "Ja" &&
        solarInjection > 0
    ) {

        summary +=
            `Injectie: ${solarInjection.toLocaleString("nl-BE")} kWh/jaar\n`;

    }


    summary +=
        `\nMijnenergie.be wordt nu geopend.`;

    alert(summary);


    // Energievergelijker openen

    window.open(
        "https://www.mijnenergie.be/energieleveranciers-vergelijken",
        "_blank",
        "noopener,noreferrer"
    );

}

/* ==========================================================
   DETAIL BUTTONS
========================================================== */

function initDetailButtons() {

    const edit =
        document.getElementById("editContractBtn");

    const remove =
        document.getElementById("deleteContractBtn");

    const compareEnergy =
        document.getElementById("compareEnergyBtn");

    compareEnergy?.addEventListener("click", () => {

    if (!selectedContract) {
        return;
    }

    if (
        selectedContract.category.toLowerCase() !== "energie"
    ) {
        return;
    }

    closeDetailModal();

    ckaiCurrentContract =
        selectedContract;

    openCKAI();

    openCKAIEnergyComparison();

});
    
        edit?.addEventListener("click", () => {

        if (!selectedContract) return;

        closeDetailModal();

        openEditModal(selectedContract.id);

    });

    remove?.addEventListener("click", () => {

        if (!selectedContract) return;

        if (!confirm(
            `Weet je zeker dat je "${selectedContract.name}" wilt verwijderen?`
        )) {
            return;
        }

        ContractService.delete(
            selectedContract.id
        );

        closeDetailModal();

        renderContracts();

        updateDashboard();

        showToast("Contract verwijderd");

    });

}

/* ==========================================================
   AUTOCOMPLETE
========================================================== */

function initAutocomplete() {

    const input = document.getElementById("name");
    const suggestions = document.getElementById("nameSuggestions");

    if (!input || !suggestions) return;

    input.addEventListener("input", () => {

        const matches =
            ContractService.findServices(input.value);

        if (!matches.length) {

            suggestions.style.display = "none";
            suggestions.innerHTML = "";

            return;

        }

        suggestions.innerHTML = matches.map(service => `

            <div
                class="name-suggestion"
                data-name="${service.name}"
                data-category="${service.category}">

                <img
                    class="name-suggestion-logo"
                    src="${resolveLogoSrc(ContractService.getLogo(service.name))}"
                    alt="${service.name}">

                <div class="name-suggestion-content">

                    <strong>${service.name}</strong>

                    <small>${service.category}</small>

                </div>

            </div>

        `).join("");

        suggestions.style.display = "block";

        suggestions.querySelectorAll(".name-suggestion").forEach(item => {

            item.addEventListener("click", () => {

                input.value = item.dataset.name;

                document.getElementById("category").value =
                    item.dataset.category;

                updateTelecomPackVisibility();    

                const logo =
                    ContractService.getLogo(item.dataset.name);

                const preview =
                    document.getElementById("nameLogoPreview");

                const image =
                    document.getElementById("nameLogoImage");

                if (logo && preview && image) {

                    image.src = resolveLogoSrc(logo);

                    preview.style.display = "flex";

                }

                suggestions.style.display = "none";

                suggestions.innerHTML = "";

            });

        });

    });

}


/* ==========================================================
   TOAST
========================================================== */

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ==========================================================
   MODAL TITEL
========================================================== */

function setModalTitle(title) {

    const titleElement =
        document.querySelector("#addContractModal h2");

    if (titleElement) {

        titleElement.textContent = title;

    }

}


/* ==========================================================
   HELPERS
========================================================== */

function value(id) {

    return document.getElementById(id)?.value ?? "";

}

function setValue(id, valueToSet) {

    const element = document.getElementById(id);

    if (!element) return;

    element.value = valueToSet ?? "";

}

function resolveLogoSrc(logo) {

    if (!logo) return null;

    if (
        logo.startsWith("http://") ||
        logo.startsWith("https://")
    ) {
        return logo;
    }

    if (logo.startsWith("assets/")) {
        return logo;
    }

    return `assets/logos/${logo}`;
}
