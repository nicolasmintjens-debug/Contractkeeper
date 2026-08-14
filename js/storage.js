/* ==========================================================
   ContractKeeper
   storage.js
========================================================== */

const STORAGE_KEY = "contractkeeper.contracts";
const STORAGE_VERSION = 1;

const Storage = {

    /* ==========================
       Ophalen
    ========================== */

    getContracts() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {

                return [];

            }

            const contracts = JSON.parse(raw);

            return contracts.map(this.normalizeContract);

        }

        catch (error) {

            console.error("Fout bij laden van contracten", error);

            return [];

        }

    },



    /* ==========================
       Opslaan
    ========================== */

    saveContracts(contracts) {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(contracts)

        );

    },



    /* ==========================
       Toevoegen
    ========================== */

    addContract(contract) {

        const contracts = this.getContracts();

        contracts.push(

            this.normalizeContract(contract)

        );

        this.saveContracts(contracts);

    },



    /* ==========================
       Updaten
    ========================== */

    updateContract(id, data) {

        const contracts = this.getContracts();

        const index = contracts.findIndex(

            c => c.id === id

        );

        if (index === -1) {

            return false;

        }

        contracts[index] = {

            ...contracts[index],

            ...data,

            updatedAt: new Date().toISOString()

        };

        this.saveContracts(contracts);

        return true;

    },



    /* ==========================
       Verwijderen
    ========================== */

    deleteContract(id) {

        const contracts = this.getContracts()

            .filter(

                c => c.id !== id

            );

        this.saveContracts(contracts);

    },



    /* ==========================
       Alles wissen
    ========================== */

    clear() {

        localStorage.removeItem(STORAGE_KEY);

    },



    /* ==========================
       Demo data
    ========================== */

migrateDemoContracts() {

    const migrationKey =
        "contractkeeper.demoMigrated";

    if (localStorage.getItem(migrationKey) === "true") {
        return;
    }

    const contracts =
        this.getContracts();

    let changed = false;

    contracts.forEach(contract => {

        const isNetflixDemo =
            contract.name === "Netflix" &&
            contract.supplier === "Netflix" &&
            contract.category === "Streaming" &&
            contract.frequency === "monthly" &&
            Number(contract.amount) === 14.99 &&
            contract.endDate === "2027-01-01";

        const isProximusDemo =
            contract.name === "Proximus" &&
            contract.supplier === "Proximus" &&
            contract.category === "Internet" &&
            contract.frequency === "monthly" &&
            Number(contract.amount) === 69.99 &&
            contract.endDate === "2027-06-30";

        if (isNetflixDemo || isProximusDemo) {

            contract.isDemo = true;
            changed = true;

        }

    });

    if (changed) {
        this.saveContracts(contracts);
    }

    localStorage.setItem(
        migrationKey,
        "true"
    );

},

seed() {

    const seedKey =
        "contractkeeper.seeded";

    const alreadySeeded =
        localStorage.getItem(seedKey);

    if (alreadySeeded === "true") {

        return;

    }

    if (this.getContracts().length > 0) {

        localStorage.setItem(
            seedKey,
            "true"
        );

        return;

    }

    this.saveContracts([

        {

            id: crypto.randomUUID(),

            name: "Netflix",

            supplier: "Netflix",

            category: "Streaming",

            frequency: "monthly",

            amount: 14.99,

            endDate: "2027-01-01",

            notes: "",

            isDemo: true,

            createdAt: new Date().toISOString(),

            updatedAt: null

        },

        {

            id: crypto.randomUUID(),

            name: "Proximus",

            supplier: "Proximus",

            category: "Internet",

            frequency: "monthly",

            amount: 69.99,

            endDate: "2027-06-30",

            notes: "",

            isDemo: true,

            createdAt: new Date().toISOString(),

            updatedAt: null

        }

    ]);

    localStorage.setItem(
        seedKey,
        "true"
    );

},

    /* ==========================
       Normaliseren
    ========================== */

    normalizeContract(contract) {

        return {

            id:

                contract.id ||

                crypto.randomUUID(),

            name:

                contract.name || "",

            supplier:

                contract.supplier || "",

           category:

    contract.category || "Overig",

telecomPack:

    contract.telecomPack || "",

frequency:

    contract.frequency || "monthly",

            amount:

                Number(contract.amount) || 0,

            endDate:

                contract.endDate || "",

            notes:

    contract.notes || "",

isDemo:

    contract.isDemo === true,

createdAt:

    contract.createdAt ||
    new Date().toISOString(),

            updatedAt:

                contract.updatedAt ||

                null,

            version:

                STORAGE_VERSION

        };

    },



    /* ==========================
       Export
    ========================== */

    export() {

        return JSON.stringify(

            this.getContracts(),

            null,

            2

        );

    },



    /* ==========================
       Import
    ========================== */

    import(json) {

        try {

            const contracts = JSON.parse(json);

            this.saveContracts(

                contracts.map(

                    this.normalizeContract

                )

            );

            return true;

        }

        catch {

            return false;

        }

    }

};
