/* ==========================================================
   ContractKeeper
   contractService.js
   ========================================================== */

const ContractService = {

    /* ======================================================
       BASIS
    ====================================================== */

    getAll() {

        return Storage.getContracts();

    },

    getById(id) {

        return this.getAll().find(

            contract => contract.id === id

        ) || null;

    },

    add(contract) {

        Storage.addContract(contract);

        return this.getAll();

    },

    update(id, data) {

        return Storage.updateContract(id, data);

    },

    delete(id) {

        Storage.deleteContract(id);

        return this.getAll();

    },

    clear() {

        Storage.clear();

    },

    seed() {

        Storage.seed();

    },



    /* ======================================================
       ZOEKEN
    ====================================================== */

    search(query) {

        const value = query.toLowerCase().trim();

        return this.getAll().filter(contract => {

            return (

                contract.name.toLowerCase().includes(value) ||

                contract.supplier.toLowerCase().includes(value) ||

                contract.category.toLowerCase().includes(value)

            );

        });

    },



    /* ======================================================
       FILTER
    ====================================================== */

    filter(category) {

        if (

            !category ||

            category === "all"

        ) {

            return this.getAll();

        }

        return this.getAll().filter(

            contract =>

            contract.category === category

        );

    },



    /* ======================================================
       SORTEREN
    ====================================================== */

    sortByName() {

        return [...this.getAll()]

            .sort((a, b) =>

                a.name.localeCompare(b.name)

            );

    },

    sortByAmount() {

        return [...this.getAll()]

            .sort(

                (a, b) =>

                b.amount - a.amount

            );

    },

    sortByEndDate() {

        return [...this.getAll()]

            .sort(

                (a, b) =>

                new Date(a.endDate)

                -

                new Date(b.endDate)

            );

    },



    /* ======================================================
       DASHBOARD
    ====================================================== */

    getMonthlyTotal() {

        let total = 0;

        this.getAll().forEach(contract => {

            switch (contract.frequency) {

                case "monthly":

                    total += contract.amount;

                    break;

                case "quarterly":

                    total += contract.amount / 3;

                    break;

                case "yearly":

                    total += contract.amount / 12;

                    break;

                default:

                    break;

            }

        });

        return total;

    },



    getActiveCount() {

        return this.getAll().length;

    },



    getEndingSoon(days = 30) {

        const today = new Date();

        return this.getAll().filter(contract => {

            if (!contract.endDate) {

                return false;

            }

            const end = new Date(contract.endDate);

            const diff =

                (end - today)

                / 86400000;

            return diff >= 0 && diff <= days;

        });

    },



    getEndingSoonCount(days = 30) {

        return this.getEndingSoon(days).length;

    },

/* ======================================================
   EERSTVOLGENDE EINDDATUM
====================================================== */

getNextEndingContract() {

    const today = new Date();

    const contracts = this.getAll()

        .filter(contract => {

            if (!contract.endDate) return false;

            return new Date(contract.endDate) >= today;

        })

        .sort((a, b) =>

            new Date(a.endDate) - new Date(b.endDate)

        );

    return contracts.length ? contracts[0] : null;

},

   /* ======================================================
   GROOTSTE UITGAVE
====================================================== */

getMostExpensiveContract() {

    const contracts = this.getAll();

    if (!contracts.length) {

        return null;

    }

    return [...contracts].sort(

        (a, b) => b.amount - a.amount

    )[0];

},

/* ======================================================
   UITGAVEN PER CATEGORIE
====================================================== */

getCategoryTotals() {

    const totals = {};

    this.getAll().forEach(contract => {

        let monthly = contract.amount;

        switch (contract.frequency) {

            case "quarterly":
                monthly = contract.amount / 3;
                break;

            case "yearly":
                monthly = contract.amount / 12;
                break;

        }

        if (!totals[contract.category]) {

            totals[contract.category] = 0;

        }

        totals[contract.category] += monthly;

    });

const grandTotal = Object.values(totals)

    .reduce((sum, value) => sum + value, 0);
   
    return Object.entries(totals)

       .map(([category, total]) => ({

    category,

    total,

    percentage: grandTotal > 0

        ? (total / grandTotal) * 100

        : 0

}))

        .sort((a, b) => b.total - a.total);

},
   
    /* ======================================================
       RECENT
    ====================================================== */

    getRecent(limit = 5) {

        return [...this.getAll()]

            .sort(

                (a, b) =>

                new Date(b.createdAt)

                -

                new Date(a.createdAt)

            )

            .slice(0, limit);

    },



    /* ======================================================
       CATEGORIEËN
    ====================================================== */

    getCategories() {

        return [

            "Streaming",

            "Internet",

            "Verzekering",

            "Fitness",

            "Gaming",

            "Cloud",

            "Software",

            "Muziek",

            "Overig"

        ];

    },



    /* ======================================================
       ICONEN
    ====================================================== */

    getCategoryIcon(category) {

        const icons = {

            Streaming: "bi-film",

            Internet: "bi-wifi",

            Verzekering: "bi-shield-check",

            Fitness: "bi-heart-pulse",

            Gaming: "bi-controller",

            Cloud: "bi-cloud",

            Software: "bi-window",

            Muziek: "bi-music-note",

            Overig: "bi-folder"

        };

        return icons[category] || "bi-folder";

    },



    /* ======================================================
       BADGES
    ====================================================== */

    getCategoryBadge(category) {

        return (

            "badge-" +

            category.toLowerCase()

        );

    },



    /* ======================================================
       PRIJZEN
    ====================================================== */

    formatPrice(amount) {

        return new Intl.NumberFormat(

            "nl-BE",

            {

                style: "currency",

                currency: "EUR"

            }

        ).format(amount);

    },



    /* ======================================================
       DATUM
    ====================================================== */

    formatDate(date) {

        if (!date) {

            return "-";

        }

        return new Intl.DateTimeFormat(

            "nl-BE",

            {

                day: "numeric",

                month: "long",

                year: "numeric"

            }

        ).format(

            new Date(date)

        );

    },



    /* ======================================================
       STATUS
    ====================================================== */

    getStatus(contract) {

        if (!contract.endDate) {

            return "active";

        }

        const today = new Date();

        const end = new Date(contract.endDate);

        const diff =

            (end - today)

            / 86400000;

        if (diff < 0) {

            return "expired";

        }

        if (diff <= 30) {

            return "ending";

        }

        return "active";

    },

   getLogo(name) {

    if (!name) return null;

    const value =
        name.toLowerCase().trim();

    if (value.length < 3) {

        return null;

    }

    for (const service of SERVICES) {

        const serviceName =
            service.name.toLowerCase();

        if (

            serviceName.includes(value)

            ||

            value.includes(serviceName)

        ) {

            return service.logo;

        }

    }

    return null;

},

   findServices(search) {

    if (!search || search.length < 2) {

        return [];

    }

    const value =
        search.toLowerCase();

    return SERVICES.filter(service =>

        service.name
            .toLowerCase()
            .includes(value)

    );

},
 
/* ======================================================
   SLIMME TIPS
====================================================== */

getSmartTips() {

    const tips = [];

    /* ---------------------------------
       Grootste uitgave
    --------------------------------- */

    const highest =
        this.getMostExpensiveContract();

    if (highest) {

        tips.push({

            icon: "💰",

            title: "Grootste uitgave",

            message:
                `${highest.name} kost je ${this.formatPrice(highest.amount)} per maand.`

        });

    }

    /* ---------------------------------
       Actieve contracten
    --------------------------------- */

    tips.push({

        icon: "📄",

        title: "Actieve contracten",

        message:
            `Je hebt momenteel ${this.getActiveCount()} actieve contracten.`

    });

    /* ---------------------------------
       Maandelijkse kosten
    --------------------------------- */

    tips.push({

        icon: "💶",

        title: "Maandelijkse kosten",

        message:
            `Je betaalt gemiddeld ${this.formatPrice(this.getMonthlyTotal())} per maand.`

    });

    /* ---------------------------------
       Jaarlijkse kosten
    --------------------------------- */

    tips.push({

        icon: "📅",

        title: "Jaarlijkse kosten",

        message:
            `Op jaarbasis geef je ${this.formatPrice(this.getMonthlyTotal() * 12)} uit.`

    });

    /* ---------------------------------
       Grootste categorie
    --------------------------------- */

    const categories =
        this.getCategoryTotals();

    if (categories.length) {

        tips.push({

            icon: "📊",

            title: "Grootste categorie",

            message:
                `${categories[0].category} is momenteel je grootste uitgavenpost.`

        });

    }

    /* ---------------------------------
       Eerstvolgende einddatum
    --------------------------------- */

    const next =
        this.getNextEndingContract();

    if (next) {

        tips.push({

            icon: "📅",

            title: "Volgende einddatum",

            message:
                `${next.name} eindigt op ${this.formatDate(next.endDate)}.`

        });

    }

    /* ---------------------------------
       Contracten die aflopen
    --------------------------------- */

    const endingSoon =
        this.getEndingSoonCount();

    if (endingSoon > 0) {

        tips.push({

            icon: "⚠️",

            title: "Loopt binnenkort af",

            message:
                `${endingSoon} contract(en) lopen binnen 30 dagen af.`

        });

    }

    /* ---------------------------------
       Gemiddelde contractprijs
    --------------------------------- */

    const active =
        this.getActiveCount();

    if (active > 0) {

        const average =
            this.getMonthlyTotal() / active;

        tips.push({

            icon: "📈",

            title: "Gemiddelde kost",

            message:
                `Een contract kost gemiddeld ${this.formatPrice(average)} per maand.`

        });

    }

    /* ---------------------------------
       Aantal categorieën
    --------------------------------- */

    if (categories.length) {

        tips.push({

            icon: "📂",

            title: "Categorieën",

            message:
                `Je contracten zijn verdeeld over ${categories.length} categorieën.`

        });

    }

    /* ---------------------------------
       Alles in orde
    --------------------------------- */

    if (endingSoon === 0) {

        tips.push({

            icon: "✅",

            title: "Alles in orde",

            message:
                "Momenteel vragen geen contracten je onmiddellijke aandacht."

        });

    }

    return tips;

}
   
};
