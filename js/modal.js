/* ==========================================================
   ContractKeeper
   modal.js
========================================================== */

let editingContractId = null;
let selectedContract = null;


/* ==========================================================
   INITIALISATIE
========================================================== */

function initModal() {

    const addModal = document.getElementById("addContractModal");

    const openButton = document.getElementById("addContract");

    const closeButton = document.getElementById("closeModal");

    const closeDetailButton =
        document.getElementById("closeDetailModal");

    const form =
        document.getElementById("contractForm");

    if (openButton) {

        openButton.addEventListener(
            "click",
            openAddModal
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

    return {

        name: value("name"),

        category: value("category"),

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

    modal.classList.add("show");

}


/* ==========================================================
   DETAIL BUTTONS
========================================================== */

function initDetailButtons() {

    const edit =
        document.getElementById("editContractBtn");

    const remove =
        document.getElementById("deleteContractBtn");

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
