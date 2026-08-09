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
   CATEGORIE ADVIES
====================================================== */

getCategoryAdvice(category) {

    switch (category) {

       case "Internet":
    return "Hoeveel personen gebruiken thuis het internet? CK AI gebruikt dat om het juiste abonnement voor te stellen.";

        case "Elektriciteit":
            return "Vergelijk zeker de stroomprijs en kijk of een vast of variabel tarief beter past.";

        case "Verzekering":
            return "Vergelijk niet alleen de prijs, maar ook de waarborgen.";

        default:
            return "Dit is een goed moment om prijzen en voorwaarden te vergelijken.";

    }

},

/* ======================================================
   CK AI INSIGHTS
====================================================== */

getCKInsights() {

    const insights = [];

    const monthlyTotal = this.getMonthlyTotal();
    const yearlyTotal = monthlyTotal * 12;
    const activeCount = this.getActiveCount();
    const highest = this.getMostExpensiveContract();
    const categories = this.getCategoryTotals();
    const next = this.getNextEndingContract();
    const endingSoon = this.getEndingSoonCount();

    /* ---------------------------------
       Actie vereist
    --------------------------------- */

    if (endingSoon > 0) {

    if (endingSoon === 1 && next) {

        insights.push({

            priority: 1,

            type: "warning",

            icon: "⚠️",

            title: `${next.name} loopt binnenkort af`,

            message:
                `Je contract eindigt op ${this.formatDate(next.endDate)}.`

        });

    } else {

        insights.push({

            priority: 1,

            type: "warning",

            icon: "⚠️",

            title: "Meerdere contracten lopen binnenkort af",

            message:
                `${endingSoon} contracten lopen binnen 30 dagen af.`

        });

    }   

    }

   /* ---------------------------------
   Eerstvolgende contract
--------------------------------- */

if (next && endingSoon === 0) {

    insights.push({

        priority: 2,

        type: "reminder",

        icon: "📅",

        title: "Eerstvolgende einddatum",

        message:
            `${next.name} is je eerstvolgende contract dat afloopt. ` +
            `Einddatum: ${this.formatDate(next.endDate)}.`

    });

}

    /* ---------------------------------
   Grootste kostenpost
--------------------------------- */

if (highest) {

    const yearlyHighest = highest.amount * 12;

    insights.push({

        priority: 3,

        type: "analysis",

        icon: "💰",

        title: "Grootste kostenpost",

        message:
            `${highest.name} is je duurste contract. ` +
            `Je betaalt ${this.formatPrice(highest.amount)} per maand, ` +
            `of ${this.formatPrice(yearlyHighest)} per jaar.`

    });

}

/* ---------------------------------
   Aandeel grootste contract
--------------------------------- */

if (highest && monthlyTotal > 0) {

    const share =
        (highest.amount / monthlyTotal) * 100;

    insights.push({

        priority: 3,

        type: "analysis",

        icon: "📊",

        title: "Groot aandeel in je kosten",

        message:
            `${highest.name} vertegenwoordigt ` +
            `${share.toFixed(1).replace(".", ",")}% ` +
            `van je maandelijkse contractkosten.`

    });

}

    /* ---------------------------------
       Uitgaven
    --------------------------------- */

    insights.push({

        priority: 4,

        type: "finance",

        icon: "💶",

        title: "Uitgaven",

        message: `Je betaalt momenteel ${this.formatPrice(monthlyTotal)} per maand.`

    });

    insights.push({

        priority: 4,

        type: "finance",

        icon: "💰",

        title: "Jaaroverzicht",

        message: `Op jaarbasis geef je ${this.formatPrice(yearlyTotal)} uit aan abonnementen.`

    });

    /* ---------------------------------
       Statistieken
    --------------------------------- */

    insights.push({

        priority: 5,

        type: "statistics",

        icon: "📄",

        title: "Contracten",

        message: `Je hebt momenteel ${activeCount} actieve contracten.`

    });

    if (activeCount > 0) {

        insights.push({

            priority: 5,

            type: "statistics",

            icon: "📈",

            title: "Gemiddelde kost",

            message: `Een contract kost gemiddeld ${this.formatPrice(monthlyTotal / activeCount)} per maand.`

        });

    }

    if (categories.length) {

        insights.push({

            priority: 5,

            type: "statistics",

            icon: "📊",

            title: "Categorie",

            message: `${categories[0].category} is momenteel je grootste uitgavenpost.`

        });

        insights.push({

            priority: 5,

            type: "statistics",

            icon: "📂",

            title: "Verdeling",

            message: `Je contracten zijn verdeeld over ${categories.length} categorieën.`

        });

    }

    /* ---------------------------------
       Alles in orde
    --------------------------------- */

    if (endingSoon === 0) {

        insights.push({

            priority: 6,

            type: "success",

            icon: "✅",

            title: "Alles in orde",

            message: "Er zijn momenteel geen contracten die je onmiddellijke aandacht vragen."

        });

    }

    insights.sort((a, b) => a.priority - b.priority);

    return insights;

    }

};
