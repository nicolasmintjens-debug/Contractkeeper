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

function showDetailModal() {

    const modal = document.getElementById("contractDetailModal");

    if (!modal) {
        return;
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
