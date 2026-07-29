/* ===========================================
   ContractKeeper
   modal.js
=========================================== */

let modal = null;
let addButton = null;

/* ===========================================
   Modal initialiseren
=========================================== */

function initModal() {

    modal = document.getElementById("addContractModal");
    addButton = document.getElementById("nav-add");

    if (!modal) {
        console.error("Modal niet gevonden.");
        return;
    }

    if (!addButton) {
        console.error("Plusknop niet gevonden.");
        return;
    }

    addButton.addEventListener("click", openModal);

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            closeModal();
        }

    });

}

/* ===========================================
   Open
=========================================== */

function openModal() {

    modal.classList.add("show");

}

/* ===========================================
   Sluiten
=========================================== */

function closeModal() {

    modal.classList.remove("show");

}
