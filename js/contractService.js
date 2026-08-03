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

    const logos = {
        "netflix": "netflix.png",
        "spotify": "spotify.webp",
        "proximus": "proximus.png",
        "telenet": "telenet.png",
        "basic-fit": "basic-fit.png",
        "basic fit": "basic-fit.png",
        "disney+": "disney-plus.webp",
        "prime video": "prime-video.webp",
        "youtube premium": "youtube-premium.png",
        "apple music": "apple-music.png",
        "apple tv": "apple-tv.webp",
        "icloud": "icloud.webp",
        "microsoft 365": "microsoft-365.png",
        "mobile vikings": "mobile-vikings.png",
        "orange": "orange.webp",
        "base": "base.png",
        "scarlet": "scarlet.webp",
        "engie": "engie.png",
        "luminus": "luminus.png",
        "eneco": "eneco.png",
        "playstation plus": "playstation-plus.png",
        "xbox game pass": "xbox-gamepass.webp",
        "nintendo switch": "nintendo-switch.png",
        "streamz": "streamz.png",
        "total energies": "total-energies.png"
    };

    const value = name.toLowerCase().trim();

if (value.length < 3) {
    return null;
}

for (const key in logos) {

    if (key.includes(value) || value.includes(key)) {

        return logos[key];

    }

}

return null;
},

/* ======================================================
   SLIMME TIPS
====================================================== */

getSmartTips() {

    return [

        {
            icon: "💰",
            title: "Grootste uitgave",
            message: "..."
        }

    ];

}

};
