/* ==========================================================
   ContractKeeper
   V-test Excel → energy-prices.json

   Gebruik:
   node scripts/update-energy-prices.js "pad/naar/v-test-bestand.xlsx"

   Output:
   data/energy-prices.json
========================================================== */

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");


/* ==========================================================
   INSTELLINGEN
========================================================== */

const inputFile =
    process.argv[2];

if (!inputFile) {

    console.error(
        "❌ Geen V-testbestand opgegeven."
    );

    console.log(
        '\nGebruik bijvoorbeeld:\n' +
        'node scripts/update-energy-prices.js "202608-v-test-data-exclbtw v2_0.xlsx"\n'
    );

    process.exit(1);

}

if (!fs.existsSync(inputFile)) {

    console.error(
        `❌ Bestand niet gevonden: ${inputFile}`
    );

    process.exit(1);

}


const outputDirectory =
    path.resolve("data");

const outputFile =
    path.join(
        outputDirectory,
        "energy-prices.json"
    );


/* ==========================================================
   HELPERS
========================================================== */

function normalizeText(value) {

    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");

}


function normalizeHeader(value) {

    return normalizeText(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[()]/g, "")
        .replace(/[€%]/g, "")
        .replace(/[./_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


function toNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    if (typeof value === "number") {
        return Number.isFinite(value)
            ? value
            : null;
    }

    const cleaned =
        String(value)
            .trim()
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "");

    if (!cleaned) {
        return null;
    }

    const number =
        Number(cleaned);

    return Number.isFinite(number)
        ? number
        : null;

}


function findValue(
    row,
    aliases
) {

    const entries =
        Object.entries(row);

    for (const alias of aliases) {

        const wanted =
            normalizeHeader(alias);

        const exact =
            entries.find(
                ([header]) =>
                    normalizeHeader(header) === wanted
            );

        if (exact) {
            return exact[1];
        }

    }


    // Tweede poging:
    // gedeeltelijke overeenkomst

    for (const alias of aliases) {

        const wanted =
            normalizeHeader(alias);

        const partial =
            entries.find(([header]) => {

                const normalized =
                    normalizeHeader(header);

                return (
                    normalized.includes(wanted) ||
                    wanted.includes(normalized)
                );

            });

        if (partial) {
            return partial[1];
        }

    }

    return null;

}


/* ==========================================================
   HEADERREGEL ZOEKEN
========================================================== */

function findHeaderRow(rows) {

    const maxRows =
        Math.min(
            rows.length,
            40
        );

    for (
        let index = 0;
        index < maxRows;
        index++
    ) {

        const row =
            rows[index] || [];

        const normalized =
            row.map(normalizeHeader);

        const hasSupplier =
    normalized.some(cell =>
        cell.includes("leverancier") ||
        cell.includes("handelsnaam")
    );

        const hasProduct =
            normalized.some(cell =>
                cell.includes("product")
            );

        if (
            hasSupplier &&
            hasProduct
        ) {
            return index;
        }

    }

    return -1;

}


/* ==========================================================
   SHEET NAAR OBJECTEN
========================================================== */

function sheetToRows(
    workbook,
    sheetName
) {

    const worksheet =
        workbook.Sheets[sheetName];

    if (!worksheet) {

        console.warn(
            `⚠️ Tabblad niet gevonden: ${sheetName}`
        );

        return [];

    }


    const matrix =
        XLSX.utils.sheet_to_json(
            worksheet,
            {
                header: 1,
                defval: null,
                raw: true
            }
        );


    const headerIndex =
        findHeaderRow(matrix);

    if (headerIndex === -1) {

        console.warn(
            `⚠️ Geen header gevonden in ${sheetName}`
        );

        return [];

    }


    const headers =
        matrix[headerIndex]
            .map((header, index) => {

                const clean =
                    normalizeText(header);

                return clean ||
                    `Kolom ${index + 1}`;

            });


    const rows = [];


    for (
        let index = headerIndex + 1;
        index < matrix.length;
        index++
    ) {

        const values =
            matrix[index];

        if (!values) {
            continue;
        }


        const hasContent =
            values.some(value =>
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            );

        if (!hasContent) {
            continue;
        }


        const object = {};

        headers.forEach(
            (header, columnIndex) => {

                object[header] =
                    values[columnIndex] ?? null;

            }
        );


        rows.push(object);

    }


    console.log(
        `✅ ${sheetName}: ${rows.length} rijen gelezen`
    );

    return rows;

}


/* ==========================================================
   V-TEST RIJ UITLEZEN
========================================================== */

function readVTestRow(
    row,
    sourceType
) {

    return {

        supplier:
            normalizeText(
                findValue(
                    row,
                    [
                        "Handelsnaam",
                        "Leverancier"
                    ]
                )
            ),

        product:
            normalizeText(
                findValue(
                    row,
                    [
                        "Productnaam",
                        "Product"
                    ]
                )
            ),

        customerType:
            normalizeText(
                findValue(
                    row,
                    [
                        "Segment",
                        "Klanttype"
                    ]
                )
            ),

        energy:
            normalizeText(
                findValue(
                    row,
                    [
                        "Energietype",
                        "Energie"
                    ]
                )
            ),

        contractType:
            normalizeText(
                findValue(
                    row,
                    [
                        "Contracttype",
                        "Contract type"
                    ]
                )
            ),

        tariffType:
    normalizeText(
        findValue(
            row,
            [
                "Tarieftype",
                "Tarief",
                "Type tarief",
                "Variabel/Dynamisch",
                "Vast/variabel/dynamisch"
            ]
        )
    ) || sourceType,

        priceComponent:
            normalizeText(
                findValue(
                    row,
                    [
                        "Prijsonderdeel"
                    ]
                )
            ),

        value:
            toNumber(
                findValue(
                    row,
                    [
                        "Waarde",
                        "Prijs",
                        "Tariefwaarde"
                    ]
                )
            ),

        unit:
            normalizeText(
                findValue(
                    row,
                    [
                        "Eenheid"
                    ]
                )
            ),

        coefficientA:
    toNumber(row["a"]),

coefficientB:
    toNumber(row["b"]),

coefficientC:
    toNumber(row["c"]),

coefficientD:
    toNumber(row["d"]),

coefficientZ:
    toNumber(row["z"]),

marketValueA:
    toNumber(
        row["Waarde A (€/MWh) - VNR waarde"]
    ),

marketValueB:
    toNumber(
        row["Waarde B (€/MWh) - VNR waarde"]
    ),

marketValueC:
    toNumber(
        row["Waarde C (€/MWh) - VNR waarde"]
    ),

marketValueD:
    toNumber(
        row["Waarde D (€/MWh) - VNR waarde"]
    ),    

        indexationFormula:
            normalizeText(
                findValue(
                    row,
                    [
                        "Indexatieformule",
                        "Prijsformule",
                        "Formule"
                    ]
                )
            ),

        sourceType,

        raw: row

    };

}


/* ==========================================================
   V-TEST PRODUCTEN GROEPEREN
========================================================== */

function groupVTestProducts(
    rows,
    sourceType
) {

    const products =
        new Map();


    rows.forEach(row => {

        const item =
            readVTestRow(
                row,
                sourceType
            );


        if (
            !item.supplier ||
            !item.product
        ) {
            return;
        }


        /*
         * Alleen producten voor woningen.
         */

        if (item.customerType) {

            const segment =
                item.customerType.toLowerCase();

            if (
                !segment.includes("woning") &&
                !segment.includes("resident") &&
                !segment.includes("particul")
            ) {
                return;
            }

        }


        /*
         * Eén sleutel per energieproduct.
         */

        const key = [

            item.supplier,
            item.product,
            item.energy,
            item.contractType,
            item.tariffType,
            item.sourceType

        ]
            .map(value =>
                String(value || "")
                    .trim()
                    .toLowerCase()
            )
            .join("|");


        if (!products.has(key)) {

            products.set(
                key,
                {
                    supplier:
                        item.supplier,

                    product:
                        item.product,

                    energy:
                        item.energy,

                    contractType:
                        item.contractType,

                    tariffType:
                        item.tariffType,

                    customerType:
                        item.customerType,

                    sourceType:
                        item.sourceType,

                    prices: {

                        singleRateCentPerKwh:
                            null,

                        singleRateEuroPerKwh:
                            null,

                        dynamicRateCentPerKwh:
    null,

dynamicRateEuroPerKwh:
    null,    

                        dayRateCentPerKwh:
                            null,

                        dayRateEuroPerKwh:
                            null,

                        nightRateCentPerKwh:
                            null,

                        nightRateEuroPerKwh:
                            null,

                        exclusiveNightRateCentPerKwh:
                            null,

                        exclusiveNightRateEuroPerKwh:
                            null,

                        greenEnergyCentPerKwh:
                            null,

                        cogenerationCentPerKwh:
                            null,

                        fixedFeeEuroPerYear:
                            null

                    },

                    indexation: {

                        formula:
                            null

                    },

                    rawComponents: []

                }
            );

        }


        const product =
            products.get(key);


        product.rawComponents.push(
            item.raw
        );


        /*
         * Indexatieformule bewaren
         * indien aanwezig.
         */

        if (
            item.indexationFormula &&
            !product.indexation.formula
        ) {

            product.indexation.formula =
                item.indexationFormula;

        }


        const component =
            item.priceComponent
                .toLowerCase();


        let value =
    item.value;


/* ===========================
   VARIABELE PRIJS BEREKENEN
=========================== */

if (
    value === null &&
    !item.priceComponent
        .toLowerCase()
        .includes("vaste vergoeding") &&
    (
        item.tariffType === "Variabel" ||
        item.tariffType === "Dynamisch"
    )
) {

    const a =
        item.coefficientA || 0;

    const b =
        item.coefficientB || 0;

    const c =
        item.coefficientC || 0;

    const d =
        item.coefficientD || 0;

    const z =
        item.coefficientZ || 0;

    const A =
        item.marketValueA || 0;

    const B =
        item.marketValueB || 0;

    const C =
        item.marketValueC || 0;

    const D =
        item.marketValueD || 0;


    const calculatedValue =
        (
            a * A +
            b * B +
            c * C +
            d * D +
            z
        );


    if (
        Number.isFinite(calculatedValue) &&
        calculatedValue !== 0
    ) {

        value =
            calculatedValue;

    }

}


if (value === null) {
    return;
}

/* ===========================
   DYNAMISCH TARIEF
=========================== */

if (
    component.includes("dynamisch tarief")
) {

    product.prices.dynamicRateCentPerKwh =
        value;

    product.prices.dynamicRateEuroPerKwh =
        value / 100;

    return;

}

        /* ===========================
           ENKELVOUDIG
        =========================== */

        if (
            component.includes("enkelvoudige") &&
            component.includes("dagtarief")
        ) {

            product.prices.singleRateCentPerKwh =
                value;

            product.prices.singleRateEuroPerKwh =
                value / 100;

            return;

        }


        /* ===========================
           TWEEVOUDIG DAG
        =========================== */

        if (
            component.includes("tweevoudige") &&
            component.includes("dagtarief")
        ) {

            product.prices.dayRateCentPerKwh =
                value;

            product.prices.dayRateEuroPerKwh =
                value / 100;

            return;

        }


        /* ===========================
           TWEEVOUDIG NACHT
        =========================== */

        if (
            component.includes("tweevoudige") &&
            component.includes("nachttarief")
        ) {

            product.prices.nightRateCentPerKwh =
                value;

            product.prices.nightRateEuroPerKwh =
                value / 100;

            return;

        }


        /* ===========================
           UITSLUITEND NACHT
        =========================== */

        if (
            component.includes("uitsluitend") &&
            component.includes("nacht")
        ) {

            product.prices.exclusiveNightRateCentPerKwh =
                value;

            product.prices.exclusiveNightRateEuroPerKwh =
                value / 100;

            return;

        }


        /* ===========================
           GROENE STROOM
        =========================== */

        if (
            component.includes("groene stroom")
        ) {

            product.prices.greenEnergyCentPerKwh =
                value;

            return;

        }


        /* ===========================
           WKK
        =========================== */

        if (
            component.includes("wkk")
        ) {

            product.prices.cogenerationCentPerKwh =
                value;

            return;

        }


        /* ===========================
           VASTE VERGOEDING
        =========================== */

        if (
            component.includes("vaste vergoeding")
        ) {

            product.prices.fixedFeeEuroPerYear =
                value;

        }

    });


    return [
        ...products.values()
    ];

}


/* ==========================================================
   PRODUCT GELDIG?
========================================================== */

function isUsefulProduct(product) {

    if (
        !product.supplier ||
        !product.product
    ) {
        return false;
    }


    /*
     * Indien klanttype aanwezig is:
     * alleen residentiële producten.
     *
     * Als de kolom niet aanwezig blijkt,
     * verwijderen we niets.
     */

    if (product.customerType) {

        const customer =
            product.customerType.toLowerCase();

        const residential =
            customer.includes("woning") ||
            customer.includes("resident") ||
            customer.includes("particul");

        if (!residential) {
            return false;
        }

    }


    return true;

}


/* ==========================================================
   DUBBELE PRODUCTEN VERWIJDEREN
========================================================== */

function removeDuplicates(products) {

    const unique =
        new Map();


    products.forEach(product => {

        const key = [

            product.supplier,
            product.product,
            product.energy,
            product.contractType,
            product.tariffType,
            product.sourceType

        ]
            .map(value =>
                String(value || "")
                    .toLowerCase()
                    .trim()
            )
            .join("|");


        if (!unique.has(key)) {
            unique.set(
                key,
                product
            );
        }

    });


    return [
        ...unique.values()
    ];

}


/* ==========================================================
   MAIN
========================================================== */

function main() {

    console.log(
        "\n⚡ ContractKeeper V-test converter\n"
    );

    console.log(
        `📂 Bestand: ${inputFile}`
    );


    const workbook =
        XLSX.readFile(
            inputFile,
            {
                cellDates: true
            }
        );


    console.log(
        "\n📑 Tabbladen:"
    );

    workbook.SheetNames.forEach(
        name =>
            console.log(`   - ${name}`)
    );


    /*
     * Deze twee tabbladen bevatten
     * de daadwerkelijke maanddata.
     */

    const variableSheet =
        workbook.SheetNames.find(name =>
            name
                .toLowerCase()
                .includes("var-dyn") &&
            name.includes("2026")
        );


    const fixedSheet =
        workbook.SheetNames.find(name => {

            const lower =
                name.toLowerCase();

            return (
                lower.includes("vast") &&
                !lower.includes("producten") &&
                name.includes("2026")
            );

        });


    if (!variableSheet) {

        console.error(
            "\n❌ Tabblad met variabele/dynamische producten niet gevonden."
        );

        process.exit(1);

    }


    if (!fixedSheet) {

        console.error(
            "\n❌ Tabblad met vaste producten niet gevonden."
        );

        process.exit(1);

    }


    console.log(
        `\n🔄 Variabel/dynamisch: ${variableSheet}`
    );

    console.log(
        `🔒 Vast: ${fixedSheet}\n`
    );


    const variableRows =
        sheetToRows(
            workbook,
            variableSheet
        );


    const fixedRows =
        sheetToRows(
            workbook,
            fixedSheet
        );


    const variableProducts =
    groupVTestProducts(
        variableRows,
        "Variabel/Dynamisch"
    )
        .filter(isUsefulProduct);


const fixedProducts =
    groupVTestProducts(
        fixedRows,
        "Vast"
    )
        .filter(isUsefulProduct);


    let products = [

        ...variableProducts,
        ...fixedProducts

    ];


    products =
        removeDuplicates(
            products
        );


    /*
     * Netjes sorteren
     */

    products.sort((a, b) => {

        const supplierCompare =
            a.supplier.localeCompare(
                b.supplier,
                "nl-BE"
            );

        if (supplierCompare !== 0) {
            return supplierCompare;
        }

        return a.product.localeCompare(
            b.product,
            "nl-BE"
        );

    });


    /* ===========================
       STATISTIEKEN
    =========================== */

    const suppliers =
        [
            ...new Set(
                products
                    .map(product =>
                        product.supplier
                    )
                    .filter(Boolean)
            )
        ];


    const electricityProducts =
        products.filter(product =>
            product.energy
                .toLowerCase()
                .includes("elektr")
        );


    const gasProducts =
        products.filter(product =>
            product.energy
                .toLowerCase()
                .includes("gas")
        );


    const injectionProducts =
    products.filter(product => {

        const contractType =
            product.contractType
                .toLowerCase();

        return (
            contractType.includes("inject") ||
            contractType.includes("teruglever")
        );

    });


    /* ===========================
       JSON
    =========================== */

    const output = {

        source: {
            name:
                "V-test - Vlaamse Nutsregulator",

            file:
                path.basename(inputFile),

            website:
                "https://www.vlaamsenutsregulator.be/cijfers/v-test-data-en-energieprijscurves",

            pricesIncludeVat:
                false,

            includesNetworkTariffs:
                false,

            includesTaxesAndLevies:
                false
        },


        generatedAt:
            new Date().toISOString(),


        statistics: {

            suppliers:
                suppliers.length,

            products:
                products.length,

            electricityProducts:
                electricityProducts.length,

            gasProducts:
                gasProducts.length,

            injectionProducts:
                injectionProducts.length

        },


        suppliers,


        products

    };


    /* ===========================
       OPSLAAN
    =========================== */

    fs.mkdirSync(
        outputDirectory,
        {
            recursive: true
        }
    );


    fs.writeFileSync(
        outputFile,
        JSON.stringify(
            output,
            null,
            2
        ),
        "utf8"
    );


    console.log(
        "\n✅ Converter klaar!"
    );

    console.log(
        `📦 ${products.length} producten`
    );

    console.log(
        `🏢 ${suppliers.length} leveranciers`
    );

    console.log(
        `⚡ ${electricityProducts.length} elektriciteitsproducten`
    );

    console.log(
        `🔥 ${gasProducts.length} gasproducten`
    );

    console.log(
        `☀️ ${injectionProducts.length} injectieproducten`
    );

    console.log(
        `\n💾 Opgeslagen in:\n${outputFile}\n`
    );

}


main();