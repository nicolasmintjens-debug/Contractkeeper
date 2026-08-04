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
   const editButton = document.getElementById("editContractBtn");
const deleteButton = document.getElementById("deleteContractBtn");
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

   if (editButton) {

    editButton.addEventListener("click", () => {

        if (!selectedContract) {
            return;
        }

        closeDetailModal();

        openEditModal(selectedContract.id);

    });

}

   if (deleteButton) {

    deleteButton.addEventListener("click", () => {

        if (!selectedContract) {
            return;
        }

        const confirmed = confirm(
            `Weet je zeker dat je "${selectedContract.name}" wilt verwijderen?`
        );

        if (!confirmed) {
            return;
        }

        ContractService.delete(selectedContract.id);

        closeDetailModal();

        renderContracts();

        updateDashboard();

        showToast("Contract verwijderd");

    });

}
   
    if (form) {
        form.addEventListener("submit", saveContract);
    }

   if (nameInput) {

   nameInput.addEventListener("input", () => {

    const suggestions =
        document.getElementById("nameSuggestions");

    const matches =
        ContractService.findServices(nameInput.value);

    if (!matches.length) {

        suggestions.style.display = "none";
        suggestions.innerHTML = "";

    } else {

        suggestions.style.display = "block";

        suggestions.innerHTML = matches.map(service => `

    <div
        class="name-suggestion"
        data-name="${service.name}"
        data-category="${service.category}">

        <img
            class="name-suggestion-logo"
            src="assets/logos/${service.logo}"
            alt="${service.name}">

        <div class="name-suggestion-content">

            <strong>${service.name}</strong>

            <small>${service.category}</small>

        </div>

    </div>

`).join("");
       
        suggestions.querySelectorAll(".name-suggestion").forEach(item => {

            item.addEventListener("click", () => {

                nameInput.value = item.dataset.name;

                document.getElementById("category").value =
                    item.dataset.category;

                suggestions.style.display = "none";
                suggestions.innerHTML = "";

                const logo =
                    ContractService.getLogo(item.dataset.name);

                const preview =
                    document.getElementById("nameLogoPreview");

                const image =
                    document.getElementById("nameLogoImage");

                if (logo) {

                   image.src = `assets/logos/${logo}`;
                    preview.style.display = "flex";

                }

            });

        });

    }

});
   
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

    document.getElementById("saveContractButton").innerHTML = `
        <i class="bi bi-check-lg"></i>
        Contract opslaan
    `;

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

   document.getElementById("saveContractButton").innerHTML = `
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

  const preview = document.getElementById("nameLogoPreview");
const image = document.getElementById("nameLogoImage");

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

let selectedContract = null;

function showDetailModal(contract) {

    selectedContract = contract;

    const modal = document.getElementById("contractDetailModal");

    if (!modal) return;

    document.getElementById("detailName").textContent = contract.name;

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

    const icon = ContractService.getCategoryIcon(contract.category);
    const logo = ContractService.getLogo(contract.name);

    document.getElementById("detailHeroIcon").innerHTML = logo
        ? `<img src="assets/logos/${logo}" class="contract-logo" alt="${contract.name}">`
        : `<i class="bi ${icon}"></i>`;

    const status = ContractService.getStatus(contract);

    const badge = document.getElementById("detailStatus");

    badge.innerHTML = "";

    if (status === "active") {

        badge.textContent = "Actief";
        badge.className = "detail-hero-status active";

    }

    else if (status === "ending") {

        badge.textContent = "Eindigt binnenkort";
        badge.className = "detail-hero-status warning";

    }

    else {

        badge.textContent = "Verlopen";
        badge.className = "detail-hero-status danger";

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

}
