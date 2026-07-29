/* ===========================================
   ContractKeeper
   modal.js
=========================================== */

let modal = null;
let addButton = null;

function initModal() {

    console.log("initModal uitgevoerd");

    modal = document.getElementById("addContractModal");
    addButton = document.getElementById("nav-add");

    console.log(modal);
    console.log(addButton);

    if (!modal || !addButton) {
        console.error("Modal of knop niet gevonden.");
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
