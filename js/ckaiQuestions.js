/* ==========================================================
   CONTRACTKEEPER AI - VRAGEN
========================================================== */

const CKAI_QUESTIONS = {


/* ==========================================================
   NETFLIX - SPECIFIEK
========================================================== */

netflix: [

    {
        id: 1,
        question: "Met hoeveel personen gebruik je Netflix?",
        options: [
            "Alleen ik",
            "2 personen",
            "3 personen",
            "4 of meer"
        ]
    },

    {
        id: 2,
        question: "Welk Netflix-abonnement heb je momenteel?",
        options: [
            "Standard met reclame",
            "Standard",
            "Premium",
            "Weet ik niet"
        ]
    },

    {
        id: 3,
        question: "Kijk je regelmatig in 4K Ultra HD?",
        options: [
            "Ja",
            "Nee",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Hoe vaak kijk je gemiddeld Netflix?",
        options: [
            "Dagelijks",
            "Enkele keren per week",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 5,
        question: "Ben je tevreden over je huidige abonnement?",
        options: [
            "Zeer tevreden",
            "Tevreden",
            "Twijfel",
            "Nee"
        ]
    }

],


/* ==========================================================
   ELEKTRICITEIT
========================================================== */

elektriciteit: [

    {
        id: 1,
        question: "Welk type elektriciteitscontract heb je?",
        options: [
            "Vaste prijs",
            "Variabele prijs",
            "Dynamische prijs",
            "Weet ik niet"
        ]
    },

    {
        id: 2,
        question: "Heb je zonnepanelen?",
        options: [
            "Ja",
            "Nee",
            "Binnenkort",
            "Weet ik niet"
        ]
    },

    {
        id: 3,
        question: "Hoe hoog is je elektriciteitsverbruik ongeveer?",
        options: [
            "Laag",
            "Gemiddeld",
            "Hoog",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Wanneer heb je je energietarief voor het laatst vergeleken?",
        options: [
            "Minder dan 6 maanden geleden",
            "6 tot 12 maanden geleden",
            "Meer dan een jaar geleden",
            "Nog nooit"
        ]
    },

    {
        id: 5,
        question: "Wat is voor jou het belangrijkste?",
        options: [
            "Laagste prijs",
            "Prijszekerheid",
            "Groene energie",
            "Goede service"
        ]
    }

],


/* ==========================================================
   GAS
========================================================== */

gas: [

    {
        id: 1,
        question: "Welk type gascontract heb je?",
        options: [
            "Vaste prijs",
            "Variabele prijs",
            "Weet ik niet",
            "Niet van toepassing"
        ]
    },

    {
        id: 2,
        question: "Waarvoor gebruik je voornamelijk gas?",
        options: [
            "Verwarming",
            "Verwarming en warm water",
            "Koken",
            "Meerdere toepassingen"
        ]
    },

    {
        id: 3,
        question: "Hoe zou je je gasverbruik omschrijven?",
        options: [
            "Laag",
            "Gemiddeld",
            "Hoog",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Wanneer heb je je gastarief voor het laatst vergeleken?",
        options: [
            "Minder dan 6 maanden geleden",
            "6 tot 12 maanden geleden",
            "Meer dan een jaar geleden",
            "Nog nooit"
        ]
    },

    {
        id: 5,
        question: "Wat is voor jou het belangrijkste?",
        options: [
            "Laagste prijs",
            "Prijszekerheid",
            "Duurzaamheid",
            "Goede service"
        ]
    }

],


/* ==========================================================
   WATER
========================================================== */

water: [

    {
        id: 1,
        question: "Met hoeveel personen woon je thuis?",
        options: [
            "1 persoon",
            "2 personen",
            "3 personen",
            "4 of meer"
        ]
    },

    {
        id: 2,
        question: "Hoe zou je je waterverbruik omschrijven?",
        options: [
            "Laag",
            "Gemiddeld",
            "Hoog",
            "Weet ik niet"
        ]
    },

    {
        id: 3,
        question: "Volg je je waterverbruik regelmatig op?",
        options: [
            "Ja, regelmatig",
            "Soms",
            "Bijna nooit",
            "Nooit"
        ]
    },

    {
        id: 4,
        question: "Heb je toestellen of systemen die water besparen?",
        options: [
            "Ja, meerdere",
            "Een paar",
            "Nee",
            "Weet ik niet"
        ]
    },

    {
        id: 5,
        question: "Wil je vooral inzicht of ook besparen op je waterverbruik?",
        options: [
            "Vooral besparen",
            "Vooral inzicht",
            "Allebei",
            "Geen voorkeur"
        ]
    }

],


/* ==========================================================
   INTERNET
========================================================== */

internet: [

    {
        id: 1,
        question: "Met hoeveel personen gebruik je thuis internet?",
        options: [
            "1 persoon",
            "2 personen",
            "3 personen",
            "4 of meer"
        ]
    },

    {
        id: 2,
        question: "Waarvoor gebruik je internet vooral?",
        options: [
            "Surfen en streaming",
            "Thuiswerken",
            "Gaming",
            "Intensief gemengd gebruik"
        ]
    },

    {
        id: 3,
        question: "Ben je tevreden over je huidige snelheid?",
        options: [
            "Zeer tevreden",
            "Meestal tevreden",
            "Soms te traag",
            "Vaak te traag"
        ]
    },

    {
        id: 4,
        question: "Heb je regelmatig problemen met wifi in huis?",
        options: [
            "Nooit",
            "Soms",
            "Regelmatig",
            "Heel vaak"
        ]
    },

    {
        id: 5,
        question: "Wat is voor jou het belangrijkste bij internet?",
        options: [
            "Laagste prijs",
            "Hoge snelheid",
            "Stabiele verbinding",
            "Goede klantenservice"
        ]
    }

],


/* ==========================================================
   MOBIEL
========================================================== */

mobiel: [

    {
        id: 1,
        question: "Hoeveel mobiele data gebruik je gemiddeld?",
        options: [
            "Minder dan 5 GB",
            "5 tot 20 GB",
            "20 tot 50 GB",
            "Meer dan 50 GB"
        ]
    },

    {
        id: 2,
        question: "Hoe vaak bel je via je mobiele abonnement?",
        options: [
            "Bijna nooit",
            "Af en toe",
            "Regelmatig",
            "Heel vaak"
        ]
    },

    {
        id: 3,
        question: "Heb je aan het einde van de maand meestal data over?",
        options: [
            "Heel veel",
            "Een beetje",
            "Bijna niets",
            "Ik kom data tekort"
        ]
    },

    {
        id: 4,
        question: "Zit een smartphone inbegrepen in je abonnement?",
        options: [
            "Ja",
            "Nee",
            "Toestel is al afbetaald",
            "Weet ik niet"
        ]
    },

    {
        id: 5,
        question: "Wat vind je het belangrijkste?",
        options: [
            "Laagste prijs",
            "Veel mobiele data",
            "Beste netwerk",
            "Flexibiliteit"
        ]
    }

],


/* ==========================================================
   TV
========================================================== */

tv: [

    {
        id: 1,
        question: "Hoe vaak kijk je klassieke televisie?",
        options: [
            "Dagelijks",
            "Enkele keren per week",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 2,
        question: "Gebruik je vooral live-tv of streaming?",
        options: [
            "Vooral live-tv",
            "Beide ongeveer evenveel",
            "Vooral streaming",
            "Bijna geen van beide"
        ]
    },

    {
        id: 3,
        question: "Gebruik je betaalde extra zenderpakketten?",
        options: [
            "Ja, regelmatig",
            "Ja, maar weinig",
            "Nee",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Neem je televisie af in een bundel?",
        options: [
            "Ja, met internet",
            "Ja, met internet en mobiel",
            "Nee",
            "Weet ik niet"
        ]
    },

    {
        id: 5,
        question: "Zou je zonder klassiek tv-abonnement kunnen?",
        options: [
            "Ja",
            "Waarschijnlijk wel",
            "Waarschijnlijk niet",
            "Nee"
        ]
    }

],


/* ==========================================================
   STREAMING
========================================================== */

streaming: [

    {
        id: 1,
        question: "Met hoeveel personen gebruik je deze streamingdienst?",
        options: [
            "Alleen ik",
            "2 personen",
            "3 personen",
            "4 of meer"
        ]
    },

    {
        id: 2,
        question: "Hoe vaak gebruik je deze streamingdienst?",
        options: [
            "Dagelijks",
            "Enkele keren per week",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 3,
        question: "Hoeveel andere streamingdiensten betaal je nog?",
        options: [
            "Geen",
            "1 andere",
            "2 andere",
            "3 of meer"
        ]
    },

    {
        id: 4,
        question: "Gebruik je alle functies van je huidige abonnement?",
        options: [
            "Ja",
            "Grotendeels",
            "Niet echt",
            "Weet ik niet"
        ]
    },

    {
        id: 5,
        question: "Ben je tevreden over de prijs die je betaalt?",
        options: [
            "Zeer tevreden",
            "Tevreden",
            "Twijfel",
            "Nee"
        ]
    }

],


/* ==========================================================
   MUZIEK
========================================================== */

muziek: [

    {
        id: 1,
        question: "Met hoeveel personen gebruik je deze muziekdienst?",
        options: [
            "Alleen ik",
            "2 personen",
            "Gezin",
            "Meerdere personen"
        ]
    },

    {
        id: 2,
        question: "Hoe vaak luister je via deze dienst?",
        options: [
            "Dagelijks",
            "Enkele keren per week",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 3,
        question: "Gebruik je functies waarvoor een betaald abonnement nodig is?",
        options: [
            "Ja, vaak",
            "Soms",
            "Bijna nooit",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Betaal je nog voor andere muziekdiensten?",
        options: [
            "Nee",
            "1 andere",
            "2 andere",
            "Meer dan 2"
        ]
    },

    {
        id: 5,
        question: "Ben je tevreden over je huidige abonnement?",
        options: [
            "Zeer tevreden",
            "Tevreden",
            "Twijfel",
            "Nee"
        ]
    }

],


/* ==========================================================
   GAMING
========================================================== */

gaming: [

    {
        id: 1,
        question: "Hoe vaak gebruik je dit gamingabonnement?",
        options: [
            "Dagelijks",
            "Enkele keren per week",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 2,
        question: "Speel je vooral games die inbegrepen zijn in het abonnement?",
        options: [
            "Bijna altijd",
            "Regelmatig",
            "Soms",
            "Bijna nooit"
        ]
    },

    {
        id: 3,
        question: "Gebruik je online multiplayer?",
        options: [
            "Heel vaak",
            "Regelmatig",
            "Soms",
            "Nooit"
        ]
    },

    {
        id: 4,
        question: "Heb je nog andere gamingabonnementen?",
        options: [
            "Nee",
            "1 ander",
            "2 andere",
            "3 of meer"
        ]
    },

    {
        id: 5,
        question: "Vind je dat je voldoende waarde uit het abonnement haalt?",
        options: [
            "Absoluut",
            "Waarschijnlijk wel",
            "Ik twijfel",
            "Nee"
        ]
    }

],


/* ==========================================================
   CLOUD
========================================================== */

cloud: [

    {
        id: 1,
        question: "Hoeveel van je cloudopslag gebruik je ongeveer?",
        options: [
            "Minder dan 25%",
            "25% tot 50%",
            "50% tot 80%",
            "Meer dan 80%"
        ]
    },

    {
        id: 2,
        question: "Waarvoor gebruik je cloudopslag voornamelijk?",
        options: [
            "Foto's en video's",
            "Documenten",
            "Back-ups",
            "Alles door elkaar"
        ]
    },

    {
        id: 3,
        question: "Betaal je nog voor andere cloudopslag?",
        options: [
            "Nee",
            "1 andere dienst",
            "2 andere diensten",
            "Meer dan 2"
        ]
    },

    {
        id: 4,
        question: "Deel je je opslag met anderen?",
        options: [
            "Nee",
            "Met 1 persoon",
            "Met gezin",
            "Met meerdere personen"
        ]
    },

    {
        id: 5,
        question: "Heb je momenteel meer opslag dan je nodig hebt?",
        options: [
            "Ja",
            "Misschien",
            "Nee",
            "Weet ik niet"
        ]
    }

],


/* ==========================================================
   SOFTWARE
========================================================== */

software: [

    {
        id: 1,
        question: "Hoe vaak gebruik je deze software?",
        options: [
            "Dagelijks",
            "Enkele keren per week",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 2,
        question: "Gebruik je de software privé of professioneel?",
        options: [
            "Privé",
            "Professioneel",
            "Beide",
            "Voor studie"
        ]
    },

    {
        id: 3,
        question: "Gebruik je de meeste functies van je abonnement?",
        options: [
            "Ja",
            "De meeste",
            "Slechts enkele",
            "Bijna geen"
        ]
    },

    {
        id: 4,
        question: "Ken je goedkopere of gratis alternatieven?",
        options: [
            "Ja",
            "Enkele",
            "Nee",
            "Nog niet bekeken"
        ]
    },

    {
        id: 5,
        question: "Zou je overstappen naar een goedkoper alternatief?",
        options: [
            "Ja",
            "Misschien",
            "Alleen als het eenvoudig is",
            "Nee"
        ]
    }

],


/* ==========================================================
   VERZEKERING
========================================================== */

verzekering: [

    {
        id: 1,
        question: "Wanneer heb je deze verzekering voor het laatst vergeleken?",
        options: [
            "Minder dan een jaar geleden",
            "1 tot 2 jaar geleden",
            "Meer dan 2 jaar geleden",
            "Nog nooit"
        ]
    },

    {
        id: 2,
        question: "Weet je welke dekkingen inbegrepen zijn?",
        options: [
            "Ja, volledig",
            "Grotendeels",
            "Niet echt",
            "Nee"
        ]
    },

    {
        id: 3,
        question: "Heb je meerdere verzekeringen bij dezelfde maatschappij?",
        options: [
            "Ja",
            "Nee",
            "Gedeeltelijk",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Heb je de afgelopen jaren gebruikgemaakt van deze verzekering?",
        options: [
            "Meerdere keren",
            "Eén keer",
            "Nee",
            "Niet van toepassing"
        ]
    },

    {
        id: 5,
        question: "Wat vind je het belangrijkste?",
        options: [
            "Laagste premie",
            "Goede dekking",
            "Lage franchise",
            "Goede service"
        ]
    }

],


/* ==========================================================
   BANK
========================================================== */

bank: [

    {
        id: 1,
        question: "Hoe vaak gebruik je deze bankrekening?",
        options: [
            "Dagelijks",
            "Regelmatig",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 2,
        question: "Betaal je voor je rekening of bankpakket?",
        options: [
            "Ja",
            "Nee",
            "Gedeeltelijk",
            "Weet ik niet"
        ]
    },

    {
        id: 3,
        question: "Gebruik je de extra voordelen van je bankpakket?",
        options: [
            "Vaak",
            "Soms",
            "Bijna nooit",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Heb je rekeningen bij meerdere banken?",
        options: [
            "Nee",
            "2 banken",
            "3 banken",
            "Meer dan 3"
        ]
    },

    {
        id: 5,
        question: "Wat is voor jou het belangrijkste bij een bank?",
        options: [
            "Lage kosten",
            "Goede app",
            "Persoonlijke service",
            "Extra voordelen"
        ]
    }

],


/* ==========================================================
   LIDMAATSCHAP
========================================================== */

lidmaatschap: [

    {
        id: 1,
        question: "Hoe vaak maak je gebruik van dit lidmaatschap?",
        options: [
            "Heel vaak",
            "Regelmatig",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 2,
        question: "Welke voordelen gebruik je daadwerkelijk?",
        options: [
            "Bijna allemaal",
            "Meerdere",
            "Slechts één of twee",
            "Geen"
        ]
    },

    {
        id: 3,
        question: "Wordt het lidmaatschap automatisch verlengd?",
        options: [
            "Ja",
            "Nee",
            "Weet ik niet",
            "Niet van toepassing"
        ]
    },

    {
        id: 4,
        question: "Wanneer heb je voor het laatst bekeken of je dit nog nodig hebt?",
        options: [
            "Recent",
            "Dit jaar",
            "Meer dan een jaar geleden",
            "Nog nooit"
        ]
    },

    {
        id: 5,
        question: "Zou je het lidmaatschap missen als je het stopzet?",
        options: [
            "Zeker",
            "Waarschijnlijk",
            "Waarschijnlijk niet",
            "Nee"
        ]
    }

],


/* ==========================================================
   FITNESS
========================================================== */

fitness: [

    {
        id: 1,
        question: "Hoe vaak ga je gemiddeld sporten?",
        options: [
            "3 keer of meer per week",
            "1 tot 2 keer per week",
            "Enkele keren per maand",
            "Bijna nooit"
        ]
    },

    {
        id: 2,
        question: "Gebruik je extra diensten van je abonnement?",
        options: [
            "Ja, regelmatig",
            "Soms",
            "Bijna nooit",
            "Er zijn geen extra diensten"
        ]
    },

    {
        id: 3,
        question: "Hoe flexibel is je huidige abonnement?",
        options: [
            "Maandelijks opzegbaar",
            "Jaarcontract",
            "Langere looptijd",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Ben je tevreden over de locatie en faciliteiten?",
        options: [
            "Zeer tevreden",
            "Tevreden",
            "Twijfel",
            "Nee"
        ]
    },

    {
        id: 5,
        question: "Zou een goedkoper abonnement voldoende zijn?",
        options: [
            "Waarschijnlijk wel",
            "Misschien",
            "Waarschijnlijk niet",
            "Nee"
        ]
    }

],


/* ==========================================================
   VOERTUIG
========================================================== */

voertuig: [

    {
        id: 1,
        question: "Welk type voertuigcontract is dit?",
        options: [
            "Financiering",
            "Leasing",
            "Onderhoud",
            "Andere"
        ]
    },

    {
        id: 2,
        question: "Hoe vaak gebruik je het voertuig?",
        options: [
            "Dagelijks",
            "Meerdere keren per week",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 3,
        question: "Zijn onderhoud of andere diensten inbegrepen?",
        options: [
            "Ja, volledig",
            "Gedeeltelijk",
            "Nee",
            "Weet ik niet"
        ]
    },

    {
        id: 4,
        question: "Weet je wanneer het contract eindigt?",
        options: [
            "Ja",
            "Ongeveer",
            "Nee",
            "Niet van toepassing"
        ]
    },

    {
        id: 5,
        question: "Ben je tevreden over de totale maandelijkse kost?",
        options: [
            "Zeer tevreden",
            "Tevreden",
            "Twijfel",
            "Nee"
        ]
    }

],


/* ==========================================================
   GEZONDHEID
========================================================== */

gezondheid: [

    {
        id: 1,
        question: "Hoe vaak gebruik je deze dienst of dit abonnement?",
        options: [
            "Heel regelmatig",
            "Regelmatig",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 2,
        question: "Gebruik je alle inbegrepen diensten?",
        options: [
            "Ja",
            "De meeste",
            "Slechts enkele",
            "Bijna geen"
        ]
    },

    {
        id: 3,
        question: "Is dit abonnement maandelijks opzegbaar?",
        options: [
            "Ja",
            "Nee",
            "Weet ik niet",
            "Niet van toepassing"
        ]
    },

    {
        id: 4,
        question: "Heb je vergelijkbare diensten elders?",
        options: [
            "Nee",
            "Een paar",
            "Ja, meerdere",
            "Weet ik niet"
        ]
    },

    {
        id: 5,
        question: "Ben je tevreden over de prijs-kwaliteitverhouding?",
        options: [
            "Zeer tevreden",
            "Tevreden",
            "Twijfel",
            "Nee"
        ]
    }

],


/* ==========================================================
   OVERIG
========================================================== */

overig: [

    {
        id: 1,
        question: "Hoe vaak maak je gebruik van dit contract?",
        options: [
            "Heel vaak",
            "Regelmatig",
            "Af en toe",
            "Bijna nooit"
        ]
    },

    {
        id: 2,
        question: "Vind je dat je voldoende waarde krijgt voor wat je betaalt?",
        options: [
            "Zeker",
            "Waarschijnlijk wel",
            "Ik twijfel",
            "Nee"
        ]
    },

    {
        id: 3,
        question: "Weet je wanneer dit contract eindigt of verlengd wordt?",
        options: [
            "Ja",
            "Ongeveer",
            "Nee",
            "Niet van toepassing"
        ]
    },

    {
        id: 4,
        question: "Heb je alternatieven voor dit contract bekeken?",
        options: [
            "Recent",
            "Een tijdje geleden",
            "Nog nooit",
            "Er zijn geen alternatieven"
        ]
    },

    {
        id: 5,
        question: "Wat zou je het liefst verbeteren?",
        options: [
            "Lagere prijs",
            "Betere voorwaarden",
            "Meer flexibiliteit",
            "Ik ben tevreden"
        ]
    }

]

};