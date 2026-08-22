/* ==========================================================
   CONTRACTKEEPER
   ENERGY COMPARISON
========================================================== */

let energyPrices = [];


/* ==========================================================
   V-TEST DATA LADEN
========================================================== */

async function loadEnergyPrices() {

    try {

        const response =
            await fetch("data/energy-prices.json");

        if (!response.ok) {

            throw new Error(
                "energy-prices.json kon niet worden geladen."
            );

        }

        const data =
            await response.json();

        energyPrices =
            data.products || [];

        console.log(
            "⚡ Energieproducten geladen:",
            energyPrices.length
        );

        return energyPrices;

    } catch (error) {

        console.error(
            "❌ Fout bij laden energieproducten:",
            error
        );

        energyPrices = [];

        return [];

    }

}


/* ==========================================================
   ENERGIEPRODUCT BEREKENEN
========================================================== */

function calculateEnergyProductCost(
    product,
    electricityUsage = 0,
    gasUsage = 0
) {

    if (
        !product ||
        !product.prices
    ) {

        return 0;

    }

    const prices =
        product.prices;

    let cost = 0;


    /* ===========================
       ELEKTRICITEIT
    =========================== */

    if (
        product.energy === "Elektriciteit" &&
        electricityUsage > 0
    ) {

        const electricityPrice =
            prices.singleRateEuroPerKwh ??
            prices.dayRateEuroPerKwh ??
            prices.dynamicRateEuroPerKwh ??
            0;

        cost +=
            electricityUsage *
            electricityPrice;

    }


    /* ===========================
       GAS
    =========================== */

    if (
        product.energy === "Gas" &&
        gasUsage > 0
    ) {

        const gasPrice =
            prices.singleRateEuroPerKwh ??
            prices.dayRateEuroPerKwh ??
            prices.dynamicRateEuroPerKwh ??
            0;

        cost +=
            gasUsage *
            gasPrice;

    }


    /* ===========================
       VASTE VERGOEDING
    =========================== */

    cost +=
        Number(
            prices.fixedFeeEuroPerYear
        ) || 0;


    return cost;

}

/* ==========================================================
   HUIDIGE CONTRACTKOST BEREKENEN
========================================================== */

function calculateCurrentEnergyContractCost(
    contract
) {

    if (!contract) {

        return null;

    }


    /* ===========================
       VERBRUIK
    =========================== */

    const electricityUsage =
        Number(
            contract.electricityYearUsage
        ) || 0;

    const electricityDayUsage =
        Number(
            contract.electricityDayUsage
        ) || 0;

    const electricityNightUsage =
        Number(
            contract.electricityNightUsage
        ) || 0;

    const gasUsage =
        Number(
            contract.gasYearUsage
        ) || 0;


    /* ===========================
       PRIJZEN
    =========================== */

    const electricityPrice =
        Number(
            contract.electricityPrice
        ) || 0;

    const electricityDayPrice =
        Number(
            contract.electricityDayPrice
        ) || 0;

    const electricityNightPrice =
        Number(
            contract.electricityNightPrice
        ) || 0;

    const gasPrice =
        Number(
            contract.gasPrice
        ) || 0;

    const fixedFee =
        Number(
            contract.energyFixedFee
        ) || 0;


    /* ===========================
       ZONNEPANELEN
    =========================== */

    const solarInjection =
        Number(
            contract.solarInjectionYear
        ) || 0;

    const solarInjectionPrice =
        Number(
            contract.solarInjectionPrice
        ) || 0;


    /* ===========================
       ELEKTRICITEITSKOST
    =========================== */

    let electricityCost = 0;


    if (
        contract.energyMeterType ===
        "Dag en nacht"
    ) {

        electricityCost =
            (
                electricityDayUsage *
                electricityDayPrice
            ) +
            (
                electricityNightUsage *
                electricityNightPrice
            );

    } else {

        electricityCost =
            electricityUsage *
            electricityPrice;

    }


    /* ===========================
       GASKOST
    =========================== */

    const gasCost =
        gasUsage *
        gasPrice;


    /* ===========================
       INJECTIEVERGOEDING
    =========================== */

    const injectionRevenue =
        contract.hasSolarPanels === "Ja"
            ? solarInjection *
              solarInjectionPrice
            : 0;


    /* ===========================
       TOTALE JAARKOST
    =========================== */

    const totalCost =
        electricityCost +
        gasCost +
        fixedFee -
        injectionRevenue;


    return {

        electricityCost:
            electricityCost,

        gasCost:
            gasCost,

        fixedFee:
            fixedFee,

        injectionRevenue:
            injectionRevenue,

        totalCost:
            Math.max(
                totalCost,
                0
            )

    };

}

/* ==========================================================
   V-TEST ELEKTRICITEITSPRODUCT BEREKENEN
========================================================== */

function calculateVTestElectricityCost(
    product,
    contract
) {

    if (
        !product ||
        !product.prices ||
        !contract
    ) {

        return null;

    }


    /* ===========================
       VERBRUIK
    =========================== */

    const electricityUsage =
        Number(
            contract.electricityYearUsage
        ) || 0;

    const electricityDayUsage =
        Number(
            contract.electricityDayUsage
        ) || 0;

    const electricityNightUsage =
        Number(
            contract.electricityNightUsage
        ) || 0;


    /* ===========================
       METERTYPE
    =========================== */

    const isDualMeter =
        contract.energyMeterType === "Dag en nacht";


    /* ===========================
       PRIJZEN
    =========================== */

    const singleRate =
        Number(
            product.prices.singleRateEuroPerKwh
        ) || 0;

    const dayRate =
        Number(
            product.prices.dayRateEuroPerKwh
        ) || 0;

    const nightRate =
        Number(
            product.prices.nightRateEuroPerKwh
        ) || 0;


    /* ===========================
       CONTROLE
    =========================== */

    if (isDualMeter) {

        if (
            dayRate <= 0 ||
            nightRate <= 0
        ) {

            return null;

        }

    } else {

        if (singleRate <= 0) {

            return null;

        }

    }


    /* ===========================
       VASTE VERGOEDING
    =========================== */

    const fixedFee =
        Number(
            product.prices.fixedFeeEuroPerYear
        ) || 0;


    /* ===========================
       ELEKTRICITEITSKOST
    =========================== */

    let energyCost = 0;


    if (isDualMeter) {

        energyCost =
            (electricityDayUsage * dayRate) +
            (electricityNightUsage * nightRate);

    } else {

        energyCost =
            electricityUsage * singleRate;

    }


    /* ===========================
       TOTAAL
    =========================== */

    const totalCost =
        energyCost +
        fixedFee;


    return {

        supplier:
            product.supplier,

        product:
            product.product,

        tariffType:
            product.tariffType,

        electricityUsage:
            electricityUsage,

        electricityDayUsage:
            electricityDayUsage,

        electricityNightUsage:
            electricityNightUsage,

        electricityPrice:
            isDualMeter
                ? null
                : singleRate,

        electricityDayPrice:
            isDualMeter
                ? dayRate
                : null,

        electricityNightPrice:
            isDualMeter
                ? nightRate
                : null,

        energyCost:
            energyCost,

        fixedFee:
            fixedFee,

        totalCost:
            totalCost

    };

}

/* ==========================================================
   TEST ENERGIEPRODUCT
========================================================== */

function testEnergyProductCalculation() {

    const product =
        energyPrices.find(
            item =>
                item.energy === "Elektriciteit" &&
                item.contractType === "Afname"
        );

    if (!product) {

        console.error(
            "❌ Geen elektriciteitsproduct gevonden."
        );

        return;

    }

    const cost =
        calculateEnergyProductCost(
            product,
            3500,
            0
        );

    console.log(
        "🧪 Testproduct:",
        product.supplier,
        product.product
    );

    console.log(
        "💰 Geschatte jaarlijkse kost:",
        cost.toFixed(2),
        "euro"
    );

}

/* ==========================================================
   V-TEST GASPRODUCT BEREKENEN
========================================================== */

function calculateVTestGasCost(
    product,
    contract
) {

    if (
        !product ||
        !product.prices ||
        !contract
    ) {

        return null;

    }


    const gasUsage =
    getGasUsageInKwh(contract);


    const gasPrice =
        Number(
            product.prices.singleRateEuroPerKwh
        ) || 0;


    const fixedFee =
        Number(
            product.prices.fixedFeeEuroPerYear
        ) || 0;


    const energyCost =
        gasUsage *
        gasPrice;


    const totalCost =
        energyCost +
        fixedFee;


    return {

        supplier:
            product.supplier,

        product:
            product.product,

        tariffType:
            product.tariffType,

        gasUsage:
            gasUsage,

        gasPrice:
            gasPrice,

        energyCost:
            energyCost,

        fixedFee:
            fixedFee,

        totalCost:
            totalCost

    };

}

/* ==========================================================
   V-TEST COMBINATIE ELEKTRICITEIT + GAS
========================================================== */

function calculateCombinedVTestEnergyCost(
    electricityProduct,
    gasProduct,
    contract
) {

    if (
        !electricityProduct ||
        !gasProduct ||
        !contract
    ) {

        return null;

    }


    const electricityResult =
        calculateVTestElectricityCost(
            electricityProduct,
            contract
        );


    const gasResult =
        calculateVTestGasCost(
            gasProduct,
            contract
        );


    if (
        !electricityResult ||
        !gasResult
    ) {

        return null;

    }


    const injectionProduct =
    energyPrices.find(
        product =>
            product.energy === "Elektriciteit" &&
            product.contractType === "Injectie" &&
            product.supplier ===
                electricityProduct.supplier
    );

const solarInjection =
    Number(
        contract.solarInjectionYear
    ) || 0;


/* ===========================
   ZONNEPANELEN
=========================== */

if (
    contract.hasSolarPanels === "Ja" &&
    !injectionProduct
) {

    return null;

}

const injectionPrice =
    injectionProduct?.prices
        ?.singleRateEuroPerKwh ??
    injectionProduct?.prices
        ?.dynamicRateEuroPerKwh ??
    injectionProduct?.prices
        ?.dayRateEuroPerKwh ??
    0;


const injectionRevenue =
    contract.hasSolarPanels === "Ja"
        ? solarInjection *
          injectionPrice
        : 0;


const totalCost =
    electricityResult.totalCost +
    gasResult.totalCost -
    injectionRevenue;


    return {

    supplier:
        electricityProduct.supplier,

    electricityProduct:
        electricityProduct.product,

    gasProduct:
        gasProduct.product,

    electricityCost:
        electricityResult.energyCost,

    gasCost:
        gasResult.energyCost,

    fixedFee:
        electricityResult.fixedFee +
        gasResult.fixedFee,

    injectionRevenue:
        injectionRevenue,

    injectionPrice:
        injectionPrice,

    totalCost:
        totalCost

};

}

/* ==========================================================
   BESTE ENERGIECOMBINATIES PER LEVERANCIER
========================================================== */

/* ==========================================================
   BESTE ENERGIEALTERNATIEVEN
========================================================== */

function findBestEnergyCombinations(
    contract
) {

    if (!contract) {
        return [];
    }


    /* ===========================
       ELEKTRICITEIT
    =========================== */

    if (
        contract.energyType === "Elektriciteit"
    ) {

        const electricityProducts =
            getRelevantEnergyProducts(
                "Elektriciteit"
            );

        const results =
            electricityProducts
                .map(product =>
                    calculateVTestElectricityCost(
                        product,
                        contract
                    )
                )
                .filter(Boolean)
                .map(result => ({
                    ...result,

                    supplier:
                        result.supplier,

                    electricityProduct:
                        result.product,

                    gasProduct:
                        null
                }));


        return results.sort(
            (a, b) =>
                a.totalCost - b.totalCost
        );
    }


    /* ===========================
       GAS
    =========================== */

    if (
        contract.energyType === "Gas"
    ) {

        const gasProducts =
            getRelevantEnergyProducts(
                "Gas"
            );

        const results =
            gasProducts
                .map(product =>
                    calculateVTestGasCost(
                        product,
                        contract
                    )
                )
                .filter(Boolean)
                .map(result => ({
                    ...result,

                    supplier:
                        result.supplier,

                    electricityProduct:
                        null,

                    gasProduct:
                        result.product
                }));


        return results.sort(
            (a, b) =>
                a.totalCost - b.totalCost
        );
    }


    /* ===========================
       ELEKTRICITEIT + GAS
    =========================== */

    if (
        contract.energyType ===
        "Elektriciteit + gas"
    ) {

        const electricityProducts =
            getRelevantEnergyProducts(
                "Elektriciteit"
            );

        const gasProducts =
            getRelevantEnergyProducts(
                "Gas"
            );

        const hasSolarPanels =
            contract.hasSolarPanels === "Ja";


        const suppliers =
            [
                ...new Set(
                    electricityProducts.map(
                        product =>
                            product.supplier
                    )
                )
            ];


        const results = [];


        suppliers.forEach(
            supplier => {

                const supplierElectricityProducts =
                    electricityProducts.filter(
                        product =>
                            product.supplier ===
                            supplier
                    );


                const supplierGasProducts =
                    gasProducts.filter(
                        product =>
                            product.supplier ===
                            supplier
                    );


                if (
                    !supplierElectricityProducts.length ||
                    !supplierGasProducts.length
                ) {
                    return;
                }


                /* ===========================
                   INJECTIEPRODUCT
                =========================== */

                let injectionProduct = null;


                if (hasSolarPanels) {

                    injectionProduct =
                        energyPrices.find(
                            product =>
                                product.energy ===
                                    "Elektriciteit" &&
                                product.contractType ===
                                    "Injectie" &&
                                product.supplier ===
                                    supplier
                        );


                    if (!injectionProduct) {
                        return;
                    }
                }


                /* ===========================
                   ALLE COMBINATIES
                =========================== */

                let bestResult = null;


                supplierElectricityProducts.forEach(
                    electricityProduct => {

                        supplierGasProducts.forEach(
                            gasProduct => {

                                const result =
                                    calculateCombinedVTestEnergyCost(
                                        electricityProduct,
                                        gasProduct,
                                        contract
                                    );


                                if (!result) {
                                    return;
                                }


                                if (
                                    !bestResult ||
                                    result.totalCost <
                                    bestResult.totalCost
                                ) {

                                    bestResult = {

                                        ...result,

                                        supplier:
                                            supplier,

                                        injectionProduct:
                                            injectionProduct

                                    };
                                }

                            }
                        );
                    }
                );


                if (bestResult) {

                    results.push(
                        bestResult
                    );
                }

            }
        );


        return results.sort(
            (a, b) =>
                a.totalCost - b.totalCost
        );
    }


    /* ===========================
       ONBEKEND TYPE
    =========================== */

    return [];
}

/* ==========================================================
   TEST GECOMBINEERD ENERGIEALTERNATIEF
========================================================== */

function testCombinedVTestEnergyCalculation() {

    if (!selectedContract) {

        console.log(
            "🧪 Geen contract geselecteerd."
        );

        return;

    }


    if (
        selectedContract.category !== "Energie"
    ) {

        console.log(
            "🧪 Het geselecteerde contract is geen energiecontract."
        );

        return;

    }


    const electricityProducts =
        getRelevantEnergyProducts(
            "Elektriciteit"
        );


    const gasProducts =
        getRelevantEnergyProducts(
            "Gas"
        );


    const electricityProduct =
        electricityProducts.find(
            electricity =>
                gasProducts.some(
                    gas =>
                        gas.supplier ===
                        electricity.supplier
                )
        );


    if (!electricityProduct) {

        console.log(
            "🧪 Geen leverancier gevonden met zowel elektriciteit als gas."
        );

        return;

    }


    const gasProduct =
        gasProducts.find(
            gas =>
                gas.supplier ===
                electricityProduct.supplier
        );


    const result =
        calculateCombinedVTestEnergyCost(
            electricityProduct,
            gasProduct,
            selectedContract
        );

    if (!result) {

    console.log(
        "🧪 Dit alternatief heeft geen injectieproduct en wordt overgeslagen."
    );

    return;

}        

    console.log(
        "🧪 Gecombineerd V-test alternatief:",
        result.supplier
    );

    console.log(
        "⚡ Elektriciteit:",
        result.electricityProduct
    );

    console.log(
        "⚡ Elektriciteitskost:",
        result.electricityCost.toFixed(2),
        "euro"
    );

    console.log(
        "🔥 Gas:",
        result.gasProduct
    );

    console.log(
        "🔥 Gaskost:",
        result.gasCost.toFixed(2),
        "euro"
    );

console.log(
    "☀️ Injectievergoeding:",
    result.injectionRevenue.toFixed(2),
    "euro"
);

    console.log(
        "💰 Totale jaarlijkse kost:",
        result.totalCost.toFixed(2),
        "euro"
    );

}

/* ==========================================================
   RELEVANTE ENERGIEPRODUCTEN FILTEREN
========================================================== */

function getRelevantEnergyProducts(
    energyType
) {

    if (!energyType) {

        return [];

    }

    return energyPrices.filter(
        product => {

                    /* ===========================
           UITSLUITEN UIT VERGELIJKING
        =========================== */

        const productName =
            String(product.product || "")
                .toLowerCase();

        if (
    productName.includes("sociaal tarief") ||
    productName.includes("groepsaankoop") ||
    productName.includes("speciale aanbieding") ||
    productName.includes("prepaid")
) {

    return false;

}

            if (
                energyType === "Elektriciteit"
            ) {

                return (
                    product.energy === "Elektriciteit" &&
                    product.contractType === "Afname"
                );

            }


            if (
                energyType === "Gas"
            ) {

                return (
                    product.energy === "Gas" &&
                    product.contractType === "Afname"
                );

            }


            if (
                energyType === "Elektriciteit + gas"
            ) {

                return (
                    product.contractType === "Afname" &&
                    (
                        product.energy === "Elektriciteit" ||
                        product.energy === "Gas"
                    )
                );

            }


            return false;

        }
    );

}

/* ==========================================================
   TEST PRODUCTFILTER
========================================================== */

function testEnergyProductFilter() {

    const electricityProducts =
        getRelevantEnergyProducts(
            "Elektriciteit"
        );

    const gasProducts =
        getRelevantEnergyProducts(
            "Gas"
        );

    const combinedProducts =
        getRelevantEnergyProducts(
            "Elektriciteit + gas"
        );


    console.log(
        "🧪 Elektriciteit:",
        electricityProducts.length
    );

    console.log(
        "🧪 Gas:",
        gasProducts.length
    );

    console.log(
        "🧪 Elektriciteit + gas:",
        combinedProducts.length
    );

}

/* ==========================================================
   TEST HUIDIG ENERGIECONTRACT
========================================================== */

function testCurrentEnergyContractCalculation() {

    if (!selectedContract) {

        console.log(
            "🧪 Geen contract geselecteerd."
        );

        return;

    }

    if (
        selectedContract.category !== "Energie"
    ) {

        console.log(
            "🧪 Het geselecteerde contract is geen energiecontract."
        );

        return;

    }

    const result =
        calculateCurrentEnergyContractCost(
            selectedContract
        );

    console.log(
        "🧪 Huidig energiecontract:",
        selectedContract.name
    );

    console.log(
        "⚡ Elektriciteit:",
        result.electricityCost.toFixed(2),
        "euro"
    );

    console.log(
        "🔥 Gas:",
        result.gasCost.toFixed(2),
        "euro"
    );

    console.log(
        "📄 Vaste vergoeding:",
        result.fixedFee.toFixed(2),
        "euro"
    );

    console.log(
        "☀️ Injectievergoeding:",
        result.injectionRevenue.toFixed(2),
        "euro"
    );

    console.log(
        "💰 Totale jaarlijkse kost:",
        result.totalCost.toFixed(2),
        "euro"
    );

}

/* ==========================================================
   TEST V-TEST ELEKTRICITEIT
========================================================== */

function testVTestElectricityCalculation() {

    if (!selectedContract) {

        console.log(
            "🧪 Geen contract geselecteerd."
        );

        return;

    }

    if (
        selectedContract.category !== "Energie"
    ) {

        console.log(
            "🧪 Het geselecteerde contract is geen energiecontract."
        );

        return;

    }


    const products =
        getRelevantEnergyProducts(
            "Elektriciteit"
        );


    if (!products.length) {

        console.log(
            "🧪 Geen elektriciteitsproducten gevonden."
        );

        return;

    }


    const product =
        products[0];


    const result =
        calculateVTestElectricityCost(
            product,
            selectedContract
        );


    console.log(
        "🧪 V-test elektriciteitsproduct:",
        result.supplier,
        result.product
    );

    console.log(
        "⚡ Verbruik:",
        result.electricityUsage,
        "kWh"
    );

    console.log(
        "💶 Energieprijs:",
        result.electricityPrice.toFixed(4),
        "euro/kWh"
    );

    console.log(
        "📄 Vaste vergoeding:",
        result.fixedFee.toFixed(2),
        "euro"
    );

    console.log(
        "💰 Geschatte jaarlijkse elektriciteitskost:",
        result.totalCost.toFixed(2),
        "euro"
    );

}

/* ==========================================================
   TEST V-TEST GAS
========================================================== */

function testVTestGasCalculation() {

    if (!selectedContract) {

        console.log(
            "🧪 Geen contract geselecteerd."
        );

        return;

    }


    if (
        selectedContract.category !== "Energie"
    ) {

        console.log(
            "🧪 Het geselecteerde contract is geen energiecontract."
        );

        return;

    }


    const products =
        getRelevantEnergyProducts(
            "Gas"
        );


    if (!products.length) {

        console.log(
            "🧪 Geen gasproducten gevonden."
        );

        return;

    }


    const product =
        products[0];


    const result =
        calculateVTestGasCost(
            product,
            selectedContract
        );


    console.log(
        "🧪 V-test gasproduct:",
        result.supplier,
        result.product
    );

    console.log(
        "🔥 Verbruik:",
        result.gasUsage,
        "kWh"
    );

    console.log(
        "💶 Gasprijs:",
        result.gasPrice.toFixed(4),
        "euro/kWh"
    );

    console.log(
        "📄 Vaste vergoeding:",
        result.fixedFee.toFixed(2),
        "euro"
    );

    console.log(
        "💰 Geschatte jaarlijkse gaskost:",
        result.totalCost.toFixed(2),
        "euro"
    );

}

/* ==========================================================
   START
========================================================== */

loadEnergyPrices().then(() => {

    testEnergyProductCalculation();

    testEnergyProductFilter();

});
