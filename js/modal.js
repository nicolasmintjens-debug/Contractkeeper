/* ==========================================
   ContractKeeper
   Modal
========================================== */

let modal;
let addButton;
let modalContent;

function initModal() {

    modal = document.getElementById("addContractModal");
    addButton = document.getElementById("nav-add");
    modalContent = modal.querySelector(".modal-content");

    if (!modal || !addButton || !modalContent) {
        console.error("Modal niet correct gevonden.");
        return;
    }

    addButton.addEventListener("click", openModal);

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            closeModal();
        }

    });

}

function openModal() {

    modal.classList.add("show");

}

function closeModal() {

    modal.classList.remove("show");

}
