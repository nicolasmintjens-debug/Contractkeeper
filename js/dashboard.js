/* ==========================================================
   ContractKeeper
   dashboard.js
========================================================== */

function updateDashboard() {

    updateMonthlyTotal();

    updateActiveContracts();

    updateEndingSoon();

}



/* ==========================================================
   MAANDELIJKSE KOST
========================================================== */

function updateMonthlyTotal() {

    const element = document.getElementById("monthlyTotal");

    if (!element) {

        return;

    }

    element.textContent = ContractService.formatPrice(

        ContractService.getMonthlyTotal()

    );

}



/* ==========================================================
   ACTIEVE CONTRACTEN
========================================================== */

function updateActiveContracts() {

    const element = document.getElementById("activeContracts");

    if (!element) {

        return;

    }

    element.textContent = ContractService.getActiveCount();

}



/* ==========================================================
   LOOPT BINNENKORT AF
========================================================== */

function updateEndingSoon() {

    const element = document.getElementById("endingSoon");

    if (!element) {

        return;

    }

    element.textContent = ContractService.getEndingSoonCount();

}



/* ==========================================================
   DASHBOARD VERVERSEN
========================================================== */

function refreshDashboard() {

    updateDashboard();

}
