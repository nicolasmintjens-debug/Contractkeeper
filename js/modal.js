/* ==========================================================
   ContractKeeper
   modal.js
========================================================== */

let editingContractId = null;


/* ==========================================================
   INITIALISATIE
========================================================== */

function initModal() {

    const modal = document.getElementById("addContractModal");
    const openButton = document.getElementById("addContract");
    const closeButton = document.getElementById("closeModal");
   const closeDetailButton = document.getElementById("closeDetailModal");
    const form = document.getElementById("contractForm");
   const nameInput = document.getElementById("name");

    if (openButton) {
        openButton.addEventListener("click", openAddModal);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

   if (closeDetailButton) {
    closeDetailButton.addEventListener("click", closeDetailModal);
}
   
    if (form) {
        form.addEventListener("submit", saveContract);
    }

   if (nameInput) {

    nameInput.addEventListener("input", () => {

        const logo = ContractService.getLogo(nameInput.value);

        const preview = document.getElementById("nameLogoPreview");
        const image = document.getElementById("nameLogoImage");

        if (logo) {

            image.src = `assets/logos/${logo}`;
            preview.hidden = false;

       } else {

    image.removeAttribute("src");
    preview.hidden = true;

}

    });

}
   
    modal?.addEventListener("click", e => {

        if (e.target === modal) {
            closeModal();
        }

    });

}

/* ==========================================================
   OPEN NIEUW CONTRACT
========================================================== */

function openAddModal() {

    editingContractId = null;

    resetForm();

    setModalTitle("Nieuw contract");

    showModal();

}


/* ==========================================================
   OPEN BEWERKEN
========================================================== */

function openEditModal(id) {

    const contract = ContractService.getById(id);

    if (!contract) {
        return;
    }

    editingContractId = id;

    fillForm(contract);

    setModalTitle("Contract bewerken");

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

        supplier: value("supplier"),

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

    setValue("supplier", contract.supplier);

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

   const preview = document.getElementById("nameLogoPreview");

if (preview) {
    preview.hidden = true;
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
   MODAL
========================================================== */

function showModal() {

    const modal = document.getElementById("addContractModal");

    if (!modal) {
        return;
    }

    modal.classList.add("show");

}


function closeModal() {

    const modal = document.getElementById("addContractModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    resetForm();

}

function showDetailModal(contract) {

    const modal = document.getElementById("contractDetailModal");

    if (!modal) {
        return;
    }

    document.getElementById("detailName").textContent =
        contract.name;

    document.getElementById("detailPrice").textContent =
        ContractService.formatPrice(contract.amount);

    document.getElementById("detailFrequency").textContent =
    translateFrequency(contract.frequency);

const icon = ContractService.getCategoryIcon(contract.category);
const logo = ContractService.getLogo(contract.name);

const heroIcon = document.getElementById("detailHeroIcon");

heroIcon.innerHTML = logo
    ? `<img src="assets/logos/${logo}" class="contract-logo" alt="${contract.name}">`
    : `<i class="bi ${icon}"></i>`;

    // NIEUW
    document.getElementById("detailSupplier").textContent =
        contract.supplier || "-";

    document.getElementById("detailCategory").textContent =
        contract.category || "-";

    document.getElementById("detailEndDate").textContent =
    contract.endDate
        ? ContractService.formatDate(contract.endDate)
        : "-";

/* STATUS */

const status = document.getElementById("detailStatus");

if (status) {

    if (!contract.endDate) {

        status.innerHTML =
            '<span class="status-dot"></span>Geen einddatum';

status.style.background = "rgba(59,130,246,.12)";
status.style.color = "#60A5FA";
status.querySelector(".status-dot").style.background = "#60A5FA";

    } else {

        const today = new Date();
        const endDate = new Date(contract.endDate);

        today.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);

        const days =
            Math.ceil((endDate - today) / 86400000);

        if (days < 0) {

            status.innerHTML =
                '<span class="status-dot"></span>Verlopen';

            status.style.background = "rgba(239,68,68,.12)";
            status.style.color = "#F87171";
           status.querySelector(".status-dot").style.background = "#F87171";

        } else if (days <= 30) {

            status.innerHTML =
                '<span class="status-dot"></span>Eindigt binnenkort';

status.style.background = "rgba(245,158,11,.12)";
status.style.color = "#FBBF24";
status.querySelector(".status-dot").style.background = "#FBBF24";

        } else {

            status.innerHTML =
                '<span class="status-dot"></span>Actief';

status.style.background = "rgba(34,197,94,.12)";
status.style.color = "#4ADE80";
status.querySelector(".status-dot").style.background = "#4ADE80";

        }

    }

}

modal.classList.add("show");

}

function closeDetailModal() {

    const modal = document.getElementById("contractDetailModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

}

function setModalTitle(title) {

    const element = document.querySelector("#addContractModal h2");

    if (element) {
        element.textContent = title;
    }

}


/* ==========================================================
   TOAST
========================================================== */

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ==========================================================
   HELPERS
========================================================== */

function value(id) {

    return document.getElementById(id)?.value ?? "";

}


function setValue(id, value) {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.value = value ?? "";

}
