/* ======================================================
   BEKENDE DIENSTEN
====================================================== */

const BRANDFETCH_CLIENT_ID = "1idH3riPRIQ20dPfPSY"; 

const SERVICES = [

    // ======================================================
    // ENERGIE
    // ======================================================

    { name: "Engie", domain: "engie.be", category: "Energie" },
    { name: "Luminus", domain: "luminus.be", category: "Energie" },
    { name: "Eneco", domain: "eneco.be", category: "Energie" },
    { name: "Mega", domain: "mega.be", category: "Energie" },
    { name: "EnergyVision", domain: "energyvision.be", category: "Energie" },
    { name: "Energie.be", domain: "energie.be", category: "Energie" },
    { name: "Elegant", domain: "elegant.be", category: "Energie" },
    { name: "Ecopower", domain: "ecopower.be", category: "Energie" },
    { name: "Bolt", domain: "bolt.eu", category: "Energie" },
    { name: "DATS 24", domain: "dats24.be", category: "Energie" },
    { name: "Frank Energie", domain: "frankenergie.be", category: "Energie" },
    { name: "EBEM", domain: "ebem.be", category: "Energie" },
    { name: "Aspiravi Energy", domain: "aspiravi-energy.be", category: "Energie" },
    { name: "Trevion", domain: "trevion.be", category: "Energie" },

    // ======================================================
    // WATER
    // ======================================================

    { name: "Water-link", domain: "water-link.be", category: "Water" },
    { name: "De Watergroep", domain: "dewatergroep.be", category: "Water" },
    { name: "Farys", domain: "farys.be", category: "Water" },
    { name: "Pidpa", domain: "pidpa.be", category: "Water" },
    { name: "Vivaqua", domain: "vivaqua.be", category: "Water" },
    { name: "in BW", domain: "inbw.be", category: "Water" },
    { name: "SWDE", domain: "swde.be", category: "Water" },

    // ======================================================
    // INTERNET & TELEFONIE
    // ======================================================

    { name: "Proximus", domain: "proximus.be", category: "Internet" },
    { name: "Telenet", domain: "telenet.be", category: "Internet" },
    { name: "Scarlet", domain: "scarlet.be", category: "Internet" },
    { name: "DIGI", domain: "digi-belgium.be", category: "Internet" },
    { name: "edpnet", domain: "edpnet.be", category: "Internet" },
    { name: "TADAAM", domain: "tadaam.be", category: "Internet" },
    { name: "VOO", domain: "voo.be", category: "Internet" },
    { name: "Cybernet", domain: "cybernet.be", category: "Internet" },
    { name: "FASTfiber", domain: "fastfiber.be", category: "Internet" },

    { name: "Mobile Vikings", domain: "mobilevikings.be", category: "Telefonie" },
    { name: "Orange", domain: "orange.be", category: "Telefonie" },
    { name: "Base", domain: "base.be", category: "Telefonie" },
    { name: "hey!", domain: "heytelecom.be", category: "Telefonie" },
    { name: "Yoin", domain: "yoin.be", category: "Telefonie" },
    { name: "UNDO", domain: "undo.be", category: "Telefonie" },
    { name: "Neibo", domain: "neibo.be", category: "Telefonie" },
    { name: "IP Telecom", domain: "iptelecom.be", category: "Telefonie" },

    // ======================================================
    // STREAMING
    // ======================================================

    { name: "Netflix", domain: "netflix.com", category: "Streaming" },
    { name: "Disney+", domain: "disneyplus.com", category: "Streaming" },
    { name: "YouTube Premium", domain: "youtube.com", category: "Streaming" },
    { name: "Apple TV+", domain: "apple.com", category: "Streaming" },
    { name: "Streamz", domain: "streamz.be", category: "Streaming" },
    { name: "HBO Max", domain: "hbomax.com", category: "Streaming" },
    { name: "DAZN", domain: "dazn.com", category: "Streaming" },
    { name: "Crunchyroll", domain: "crunchyroll.com", category: "Streaming" },
    { name: "MUBI", domain: "mubi.com", category: "Streaming" },
    { name: "Plex", domain: "plex.tv", category: "Streaming" },
    { name: "Rakuten TV", domain: "rakuten.tv", category: "Streaming" },
    { name: "SkyShowtime", domain: "skyshowtime.com", category: "Streaming" },
    { name: "Hayu", domain: "hayu.com", category: "Streaming" },
    { name: "Curiosity Stream", domain: "curiositystream.com", category: "Streaming" },
    { name: "Viki", domain: "viki.com", category: "Streaming" },

    // ======================================================
    // MUZIEK
    // ======================================================

    { name: "Spotify", domain: "spotify.com", category: "Muziek" },
    { name: "Deezer", domain: "deezer.com", category: "Muziek" },
    { name: "Apple Music", domain: "apple.com", category: "Muziek" },
    { name: "TIDAL", domain: "tidal.com", category: "Muziek" },
    { name: "YouTube Music", domain: "youtube.com", category: "Muziek" },
    { name: "SoundCloud", domain: "soundcloud.com", category: "Muziek" },
    { name: "Qobuz", domain: "qobuz.com", category: "Muziek" },
    { name: "Amazon Music", domain: "music.amazon.com", category: "Muziek" },
    { name: "Napster", domain: "napster.com", category: "Muziek" },
    { name: "TuneIn", domain: "tunein.com", category: "Muziek" },

    // ======================================================
    // MEDIA
    // ======================================================

    { name: "HLN", domain: "hln.be", category: "Media" },
    { name: "De Morgen", domain: "demorgen.be", category: "Media" },
    { name: "Gazet van Antwerpen", domain: "gva.be", category: "Media" },
    { name: "Het Nieuwsblad", domain: "nieuwsblad.be", category: "Media" },
    { name: "De Standaard", domain: "standaard.be", category: "Media" },
    { name: "Knack", domain: "knack.be", category: "Media" },
    { name: "Trends", domain: "trends.be", category: "Media" },
    { name: "Het Belang van Limburg", domain: "hbvl.be", category: "Media" },
    { name: "De Tijd", domain: "tijd.be", category: "Media" },
    { name: "L'Echo", domain: "lecho.be", category: "Media" },
    { name: "Le Soir", domain: "lesoir.be", category: "Media" },
    { name: "La Libre", domain: "lalibre.be", category: "Media" },
    { name: "Sudinfo", domain: "sudinfo.be", category: "Media" },
    { name: "Humo", domain: "humo.be", category: "Media" },
    { name: "Libelle", domain: "libelle.be", category: "Media" },
    { name: "Flair", domain: "flair.be", category: "Media" },
    { name: "Feeling", domain: "feeling.be", category: "Media" },
    { name: "VRT MAX", domain: "vrt.be", category: "Media" },
    { name: "VTM GO", domain: "vtmgo.be", category: "Media" },

    // ======================================================
    // GAMING
    // ======================================================

    { name: "PlayStation Plus", domain: "playstation.com", category: "Gaming" },
    { name: "Xbox Game Pass", domain: "xbox.com", category: "Gaming" },
    { name: "Nintendo Switch Online", domain: "nintendo.com", category: "Gaming" },
    { name: "EA Play", domain: "ea.com", category: "Gaming" },
    { name: "Ubisoft+", domain: "ubisoft.com", category: "Gaming" },
    { name: "GeForce NOW", domain: "nvidia.com", category: "Gaming" },

    // ======================================================
    // SOFTWARE
    // ======================================================

    { name: "Microsoft 365", domain: "microsoft.com", category: "Software" },
    { name: "Adobe", domain: "adobe.com", category: "Software" },
    { name: "Adobe Creative Cloud", domain: "adobe.com", category: "Software" },
    { name: "Canva", domain: "canva.com", category: "Software" },
    { name: "Notion", domain: "notion.so", category: "Software" },
    { name: "Slack", domain: "slack.com", category: "Software" },
    { name: "Zoom", domain: "zoom.us", category: "Software" },
    { name: "Grammarly", domain: "grammarly.com", category: "Software" },
    { name: "GitHub", domain: "github.com", category: "Software" },
    { name: "Google Workspace", domain: "workspace.google.com", category: "Software" },
    { name: "NordVPN", domain: "nordvpn.com", category: "Software" },
    { name: "ExpressVPN", domain: "expressvpn.com", category: "Software" },

    // ======================================================
    // CLOUD
    // ======================================================

    { name: "iCloud", domain: "icloud.com", category: "Cloud" },
    { name: "Google One", domain: "one.google.com", category: "Cloud" },
    { name: "Dropbox", domain: "dropbox.com", category: "Cloud" },
    { name: "OneDrive", domain: "onedrive.com", category: "Cloud" },
    { name: "pCloud", domain: "pcloud.com", category: "Cloud" },
    { name: "MEGA", domain: "mega.io", category: "Cloud" },
    { name: "Proton Drive", domain: "proton.me", category: "Cloud" },
    { name: "Box", domain: "box.com", category: "Cloud" },

    // ======================================================
    // AI
    // ======================================================

    { name: "ChatGPT", domain: "openai.com", category: "AI" },
    { name: "Claude", domain: "anthropic.com", category: "AI" },
    { name: "Gemini", domain: "gemini.google.com", category: "AI" },
    { name: "Perplexity", domain: "perplexity.ai", category: "AI" },
    { name: "Microsoft Copilot", domain: "copilot.microsoft.com", category: "AI" },
    { name: "Midjourney", domain: "midjourney.com", category: "AI" },

    // ======================================================
    // BANK & FINANCIEEL
    // ======================================================

    { name: "KBC", domain: "kbc.be", category: "Bank & financieel" },
    { name: "Belfius", domain: "belfius.be", category: "Bank & financieel" },
    { name: "BNP Paribas Fortis", domain: "bnpparibasfortis.be", category: "Bank & financieel" },
    { name: "ING", domain: "ing.be", category: "Bank & financieel" },
    { name: "Argenta", domain: "argenta.be", category: "Bank & financieel" },
    { name: "Crelan", domain: "crelan.be", category: "Bank & financieel" },
    { name: "Keytrade Bank", domain: "keytradebank.be", category: "Bank & financieel" },
    { name: "Revolut", domain: "revolut.com", category: "Bank & financieel" },
    { name: "N26", domain: "n26.com", category: "Bank & financieel" },
    { name: "Wise", domain: "wise.com", category: "Bank & financieel" },

    // ======================================================
    // VERZEKERING
    // ======================================================

    { name: "AG Insurance", domain: "ag.be", category: "Verzekering" },
    { name: "Ethias", domain: "ethias.be", category: "Verzekering" },
    { name: "AXA", domain: "axa.be", category: "Verzekering" },
    { name: "DVV", domain: "dvv.be", category: "Verzekering" },
    { name: "Yuzzu", domain: "yuzzu.be", category: "Verzekering" },
    { name: "Allianz", domain: "allianz.be", category: "Verzekering" },

    // ======================================================
    // GEZONDHEID
    // ======================================================

    { name: "CM", domain: "cm.be", category: "Gezondheid" },
    { name: "Helan", domain: "helan.be", category: "Gezondheid" },
    { name: "Solidaris", domain: "solidaris-vlaanderen.be", category: "Gezondheid" },
    { name: "Partenamut", domain: "partenamut.be", category: "Gezondheid" },
    { name: "LM Plus", domain: "lm-ml.be", category: "Gezondheid" },
    { name: "NZVL", domain: "nzvl.be", category: "Gezondheid" },

    // ======================================================
    // FITNESS & SPORT
    // ======================================================

    { name: "Basic Fit", domain: "basic-fit.com", category: "Fitness & sport" },
    { name: "JIMS", domain: "jims.be", category: "Fitness & sport" },
    { name: "Sportoase", domain: "sportoase.be", category: "Fitness & sport" },
    { name: "NRG Fitness", domain: "nrgfitness.be", category: "Fitness & sport" },
    { name: "David Lloyd Clubs", domain: "davidlloyd.be", category: "Fitness & sport" },
    { name: "Snap Fitness", domain: "snapfitness.com", category: "Fitness & sport" },
    { name: "Anytime Fitness", domain: "anytimefitness.com", category: "Fitness & sport" },
    { name: "CrossFit", domain: "crossfit.com", category: "Fitness & sport" },
    { name: "Strava", domain: "strava.com", category: "Fitness & sport" },
    { name: "Garmin Connect", domain: "garmin.com", category: "Fitness & sport" },
    { name: "Fitbit", domain: "fitbit.com", category: "Fitness & sport" },
    { name: "Freeletics", domain: "freeletics.com", category: "Fitness & sport" },
    { name: "Zwift", domain: "zwift.com", category: "Fitness & sport" },

    // ======================================================
    // AUTO & MOBILITEIT
    // ======================================================

    { name: "TotalEnergies", domain: "totalenergies.com", category: "Auto & mobiliteit" },
    { name: "NMBS", domain: "belgiantrain.be", category: "Auto & mobiliteit" },
    { name: "De Lijn", domain: "delijn.be", category: "Auto & mobiliteit" },
    { name: "Cambio", domain: "cambio.be", category: "Auto & mobiliteit" },
    { name: "Poppy", domain: "poppy.be", category: "Auto & mobiliteit" },
    { name: "Touring", domain: "touring.be", category: "Auto & mobiliteit" },
    { name: "VAB", domain: "vab.be", category: "Auto & mobiliteit" },
    { name: "Q-Park", domain: "q-park.be", category: "Auto & mobiliteit" },
    { name: "Interparking", domain: "interparking.be", category: "Auto & mobiliteit" },
    { name: "Fastned", domain: "fastnedcharging.com", category: "Auto & mobiliteit" },
    { name: "IONITY", domain: "ionity.eu", category: "Auto & mobiliteit" },
    { name: "Q8", domain: "q8.be", category: "Auto & mobiliteit" },
    { name: "Shell", domain: "shell.be", category: "Auto & mobiliteit" },
    { name: "Esso", domain: "esso.be", category: "Auto & mobiliteit" },
    { name: "Tesla", domain: "tesla.com", category: "Auto & mobiliteit" },
    { name: "Allego", domain: "allego.eu", category: "Auto & mobiliteit" },
    { name: "Electra", domain: "go-electra.com", category: "Auto & mobiliteit" },
    { name: "Miles", domain: "miles-mobility.com", category: "Auto & mobiliteit" },
    { name: "Uber", domain: "uber.com", category: "Auto & mobiliteit" },
    { name: "4411", domain: "4411.be", category: "Auto & mobiliteit" },
    { name: "Indigo", domain: "indigoneo.be", category: "Auto & mobiliteit" },

    // ======================================================
    // BEVEILIGING
    // ======================================================

    { name: "Verisure", domain: "verisure.be", category: "Beveiliging" },
    { name: "Securitas", domain: "securitas.be", category: "Beveiliging" },
    { name: "Ring", domain: "ring.com", category: "Beveiliging" },
    { name: "Arlo", domain: "arlo.com", category: "Beveiliging" },
    { name: "Eufy Security", domain: "eufy.com", category: "Beveiliging" },

    // ======================================================
    // WONEN & HUISHOUDEN
    // ======================================================

    { name: "Bulex", domain: "bulex.be", category: "Wonen & huishouden" },
    { name: "Vaillant", domain: "vaillant.be", category: "Wonen & huishouden" },
    { name: "Bosch Home Comfort", domain: "bosch-homecomfort.com", category: "Wonen & huishouden" },
    { name: "Daikin", domain: "daikin.be", category: "Wonen & huishouden" },
    { name: "Viessmann", domain: "viessmann.be", category: "Wonen & huishouden" },
    { name: "Electrolux", domain: "electrolux.be", category: "Wonen & huishouden" },
    { name: "Miele", domain: "miele.be", category: "Wonen & huishouden" },
    { name: "Coolblue", domain: "coolblue.be", category: "Wonen & huishouden" },
    { name: "Krëfel", domain: "krefel.be", category: "Wonen & huishouden" },

    // ======================================================
    // HOSTING & WEBSITES
    // ======================================================

    { name: "Combell", domain: "combell.com", category: "Hosting & websites" },
    { name: "one.com", domain: "one.com", category: "Hosting & websites" },
    { name: "Hostinger", domain: "hostinger.com", category: "Hosting & websites" },
    { name: "Wix", domain: "wix.com", category: "Hosting & websites" },
    { name: "Squarespace", domain: "squarespace.com", category: "Hosting & websites" },
    { name: "Shopify", domain: "shopify.com", category: "Hosting & websites" },
    { name: "WordPress.com", domain: "wordpress.com", category: "Hosting & websites" },
    { name: "TransIP", domain: "transip.eu", category: "Hosting & websites" },
    { name: "OVHcloud", domain: "ovhcloud.com", category: "Hosting & websites" },
    { name: "GoDaddy", domain: "godaddy.com", category: "Hosting & websites" },
    { name: "Cloudflare", domain: "cloudflare.com", category: "Hosting & websites" },
    { name: "Webflow", domain: "webflow.com", category: "Hosting & websites" },
    { name: "SiteGround", domain: "siteground.com", category: "Hosting & websites" },
    { name: "Vercel", domain: "vercel.com", category: "Hosting & websites" },
    { name: "Netlify", domain: "netlify.com", category: "Hosting & websites" },

    // ======================================================
    // MAALTIJDEN & BEZORGING
    // ======================================================

    { name: "HelloFresh", domain: "hellofresh.be", category: "Maaltijden & bezorging" },
    { name: "Foodbag", domain: "foodbag.be", category: "Maaltijden & bezorging" },
    { name: "Takeaway.com", domain: "takeaway.com", category: "Maaltijden & bezorging" },
    { name: "Uber Eats", domain: "ubereats.com", category: "Maaltijden & bezorging" },
    { name: "Deliveroo", domain: "deliveroo.be", category: "Maaltijden & bezorging" },
    { name: "Too Good To Go", domain: "toogoodtogo.com", category: "Maaltijden & bezorging" },

    // ======================================================
    // BOEKEN & LEZEN
    // ======================================================

    { name: "Audible", domain: "audible.com", category: "Boeken & lezen" },
    { name: "Storytel", domain: "storytel.com", category: "Boeken & lezen" },
    { name: "Kobo Plus", domain: "kobo.com", category: "Boeken & lezen" },
    { name: "BookBeat", domain: "bookbeat.com", category: "Boeken & lezen" },
    { name: "Nextory", domain: "nextory.com", category: "Boeken & lezen" },
    { name: "Everand", domain: "everand.com", category: "Boeken & lezen" },

    // ======================================================
    // LIDMAATSCHAP
    // ======================================================

    { name: "Amazon Prime", domain: "amazon.com.be", category: "Lidmaatschap" },
    { name: "Testaankoop", domain: "test-aankoop.be", category: "Lidmaatschap" },
    { name: "Gezinsbond", domain: "gezinsbond.be", category: "Lidmaatschap" },

    // ======================================================
    // CONTRACTKEEPER
    // ======================================================
    
    { name: "ContractKeeper", logo: "assets/logo.png", category: "Software" },

];