function displayData(fileText) {
    //const allowedColumns = ["Land", "Subsektor", "Von", "Bis", "Gas", "Emissionen", "Zeit"];
    const allowedColumns = ["Land", "Subsektor", "Von", "Bis", "Gas", "Emissionen"];

    if (!fileText) {
        console.error("Kein Inhalt zum Anzeigen: " + fileText);
        return;
    }
    const rows = fileText.split('\n').filter(row => row.trim() !== "");
    if (rows.length === 0) {
        console.error("Datei enthält keine Daten.");
        return;
    }

    const table = document.createElement('table');
    const container = document.getElementById('table-container');
    container.innerHTML = "";

    // Header + Filterzeile
    const headerRow = document.createElement('tr');
    const filterRow = document.createElement('tr');

    const allColumns = rows[0].split(",").map(h => h.trim());
    const columnIndices = allColumns.map((col, i) => allowedColumns.includes(col) ? i : -1).filter(i => i !== -1);
    const headers = columnIndices.map(i => allColumns[i]);

    headers.forEach((header, idx) => {
        const th = document.createElement('th');
        th.textContent = header.trim();
        headerRow.appendChild(th);

        const filterTh = document.createElement('th');
        const select = document.createElement('select');
        select.classList.add('column-filter');
        select.dataset.colIndex = idx;
        filterTh.appendChild(select);
        filterRow.appendChild(filterTh);
    });
    const thead = document.createElement('thead');
    thead.appendChild(headerRow);
    thead.appendChild(filterRow);
    table.appendChild(thead);

    // Datenzeilen
    const tbody = document.createElement('tbody');
    rows.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        const cells = row.split(",");
        columnIndices.forEach((colIdx) => {
            const td = document.createElement('td');
            const cell = cells[colIdx] || "";

            if (colIdx === 0 || colIdx === 2) {
                td.textContent = iso3ToCountry[cell] || cell;
            } else {
                const trimmed = cell.trim();
                const number = parseFloat(trimmed.replace(',', '.')); // Komma in Punkt für parseFloat
                if (!isNaN(number)) {
                    td.textContent = Math.round(number).toString(); // Rundung auf ganze Zahl
                } else {
                    td.textContent = trimmed || "-";
                }
            }


            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);

    makeTableSortable(table);
    addColumnFilters(table);
}

function makeTableSortable(table) {
    const headers = table.querySelectorAll('thead tr:first-child th');
    headers.forEach((header, idx) => {
        header.addEventListener('click', () => {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const isNumeric = rows.every(row => !isNaN(parseFloat(row.cells[idx].textContent.replace(/,/g, ''))));

            const currentDirection = header.classList.contains('sort-asc') ? 'asc' :
                header.classList.contains('sort-desc') ? 'desc' : null;
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

            rows.sort((a, b) => {
                let aText = a.cells[idx].textContent.trim();
                let bText = b.cells[idx].textContent.trim();

                if (isNumeric) {
                    aText = parseFloat(aText.replace(/,/g, '')) || 0;
                    bText = parseFloat(bText.replace(/,/g, '')) || 0;
                } else {
                    aText = aText.toLowerCase();
                    bText = bText.toLowerCase();
                }

                if (aText < bText) return newDirection === 'asc' ? -1 : 1;
                if (aText > bText) return newDirection === 'asc' ? 1 : -1;
                return 0;
            });

            rows.forEach(row => tbody.appendChild(row));

            headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
            header.classList.add(newDirection === 'asc' ? 'sort-asc' : 'sort-desc');
        });
    });
}

function addColumnFilters(table) {
    const selects = table.querySelectorAll('select.column-filter');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    selects.forEach(select => {
        const colIdx = parseInt(select.dataset.colIndex);
        const values = new Set();

        rows.forEach(row => {
            values.add(row.cells[colIdx].textContent);
        });

        const sortedValues = Array.from(values).sort((a, b) => a.localeCompare(b));
        select.innerHTML = '<option value="">(Alle)</option>';
        sortedValues.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            select.appendChild(option);
        });

        select.addEventListener('change', () => applyFilters(table));
    });
}

function applyFilters(table) {
    const selects = table.querySelectorAll('select.column-filter');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.forEach(row => {
        let visible = true;
        selects.forEach(select => {
            const colIdx = parseInt(select.dataset.colIndex);
            const filterVal = select.value;
            if (filterVal !== "" && row.cells[colIdx].textContent !== filterVal) {
                visible = false;
            }
        });
        row.style.display = visible ? '' : 'none';
    });
}



// file

const selector = document.getElementById('table-selector');

function loadTable(selection) {
    let files = [];

    switch(selection) {
        case "power":
            files = [
                "data/power/power1.csv",
                "data/power/power2.csv",
                "data/power/power3.csv",
            ];
            break;
        case "agriculture":
            files = [
                "data/agriculture/agriculture1.csv",
                "data/agriculture/agriculture2.csv",
                "data/agriculture/agriculture3.csv",
                "data/agriculture/agriculture4.csv",
                "data/agriculture/agriculture5.csv",
                "data/agriculture/agriculture6.csv",
                "data/agriculture/agriculture7.csv",
                "data/agriculture/agriculture8.csv",
                "data/agriculture/agriculture9.csv",
                "data/agriculture/agriculture10.csv",
                "data/agriculture/agriculture11.csv",
                "data/agriculture/agriculture12.csv",
            ];
            break;
        case "gases":
            files = [
                "data/gases/gases1.csv",
            ];
            break;
        case "manufacturing":
            files = [
                "data/manufacturing/manufacturing1.csv",
                "data/manufacturing/manufacturing2.csv",
                "data/manufacturing/manufacturing3.csv",
                "data/manufacturing/manufacturing4.csv",
                "data/manufacturing/manufacturing5.csv",
                "data/manufacturing/manufacturing6.csv",
                "data/manufacturing/manufacturing7.csv",
                "data/manufacturing/manufacturing8.csv",
                "data/manufacturing/manufacturing9.csv",
                "data/manufacturing/manufacturing10.csv",
                "data/manufacturing/manufacturing11.csv",
                "data/manufacturing/manufacturing12.csv",
                "data/manufacturing/manufacturing13.csv",
                "data/manufacturing/manufacturing14.csv",
            ];
            break;
        case "buildings":
            files = [
                "data/buildings/buildings1.csv",
                "data/buildings/buildings2.csv",
                "data/buildings/buildings3.csv",
            ];
            break;
        case "transportation":
            files = [
                "data/transportation/transportation1.csv",
                "data/transportation/transportation2.csv",
                "data/transportation/transportation3.csv",
                "data/transportation/transportation4.csv",
                "data/transportation/transportation5.csv",
                "data/transportation/transportation6.csv",
                "data/transportation/transportation7.csv",
                "data/transportation/transportation8.csv",
            ];
            break;
        case "mineral":
            files = [
                "data/mineral/mineral1.csv",
                "data/mineral/mineral2.csv",
                "data/mineral/mineral3.csv",
                "data/mineral/mineral4.csv",
                "data/mineral/mineral5.csv",
                "data/mineral/mineral6.csv",
            ];
            break;
        default:
            throw new Error(`Unbekannte Auswahl: ${selection}`);
    }

    if (files.length === 1) {
        // Einzeldatei laden
        fetch(files[0])
            .then(res => res.text())
            .then(text => displayData(text));
    } else{
        // Mehrere zusammenfügen
        loadAndMergeCSVFiles(files).then(merged => displayData(merged));
    }
}

async function loadAndMergeCSVFiles(fileList) {
    const fileContents = await Promise.all(
        fileList.map(file => fetch(file).then(res => res.text()))
    );

    const allRows = fileContents.map(text => text.trim().split('\n'));
    const header = allRows[0][0]; // Nimm Header nur aus erster Datei

    const dataRows = allRows.flatMap((rows, idx) =>
        idx === 0 ? rows.slice(1) : rows.slice(1)
    );

    return [header, ...dataRows].join('\n');
}




// Beim ersten Laden die Standard-Tabelle anzeigen
loadTable("power");

// Event listener für Auswahländerung
selector.addEventListener('change', (event) => {
    loadTable(event.target.value);
});


const iso3ToCountry = {
    AFG: "Afghanistan",
    ATA: "Antarktis",
    ABW: "Aruba",
    AGO: "Angola",
    AIA: "Anguilla",
    ALA: "Åland Islands",
    ALB: "Albania",
    AND: "Andorra",
    ARE: "United Arab Emirates",
    ARG: "Argentina",
    ARM: "Armenia",
    ASM: "American Samoa",
    ATG: "Antigua and Barbuda",
    AUS: "Australia",
    AUT: "Österreich",
    AZE: "Azerbaijan",
    BDI: "Burundi",
    BEL: "Belgium",
    BEN: "Benin",
    BES: "Bonaire, Sint Eustatius and Saba",
    BFA: "Burkina Faso",
    BGD: "Bangladesh",
    BGR: "Bulgaria",
    BHR: "Bahrain",
    BHS: "Bahamas",
    BIH: "Bosnia and Herzegovina",
    BLM: "Saint Barthélemy",
    BLR: "Belarus",
    BLZ: "Belize",
    BMU: "Bermuda",
    BOL: "Bolivia (Plurinational State of)",
    BRA: "Brazil",
    BRB: "Barbados",
    BRN: "Brunei Darussalam",
    BTN: "Bhutan",
    BVT: "Bouvet Island",
    BWA: "Botswana",
    CAF: "Central African Republic",
    CAN: "Canada",
    CCK: "Cocos (Keeling) Islands",
    CHE: "Switzerland",
    CHL: "Chile",
    CHN: "China",
    CIV: "Côte d'Ivoire",
    CMR: "Cameroon",
    COD: "Congo (the Democratic Republic of the)",
    COG: "Congo",
    COK: "Cook Islands",
    COL: "Colombia",
    COM: "Comoros",
    CPV: "Cabo Verde",
    CRI: "Costa Rica",
    CUB: "Cuba",
    CUW: "Curaçao",
    CXR: "Christmas Island",
    CYM: "Cayman Islands",
    CYP: "Cyprus",
    CZE: "Czechia",
    DEU: "Deutschland",
    DJI: "Djibouti",
    DMA: "Dominica",
    DNK: "Denmark",
    DOM: "Dominican Republic",
    DZA: "Algerien",
    ECU: "Ecuador",
    EGY: "Egypt",
    ERI: "Eritrea",
    ESH: "Western Sahara",
    ESP: "Spain",
    EST: "Estonia",
    ETH: "Ethiopia",
    FIN: "Finland",
    FJI: "Fiji",
    FLK: "Falkland Islands (Malvinas)",
    FRA: "France",
    FRO: "Faroe Islands",
    FSM: "Micronesia (Federated States of)",
    GAB: "Gabon",
    GBR: "United Kingdom of Great Britain and Northern Ireland",
    GEO: "Georgia",
    GGY: "Guernsey",
    GHA: "Ghana",
    GIB: "Gibraltar",
    GIN: "Guinea",
    GLP: "Guadeloupe",
    GMB: "Gambia",
    GNB: "Guinea-Bissau",
    GNQ: "Equatorial Guinea",
    GRC: "Greece",
    GRD: "Grenada",
    GRL: "Greenland",
    GTM: "Guatemala",
    GUF: "French Guiana",
    GUM: "Guam",
    GUY: "Guyana",
    HKG: "Hong Kong",
    HMD: "Heard Island and McDonald Islands",
    HND: "Honduras",
    HRV: "Croatia",
    HTI: "Haiti",
    HUN: "Hungary",
    IDN: "Indonesia",
    IMN: "Isle of Man",
    IND: "India",
    IOT: "British Indian Ocean Territory",
    IRL: "Ireland",
    IRN: "Iran (Islamic Republic of)",
    IRQ: "Iraq",
    ISL: "Iceland",
    ISR: "Israel",
    ITA: "Italy",
    JAM: "Jamaica",
    JEY: "Jersey",
    JOR: "Jordan",
    JPN: "Japan",
    KAZ: "Kazakhstan",
    KEN: "Kenya",
    KGZ: "Kyrgyzstan",
    KHM: "Cambodia",
    KIR: "Kiribati",
    KNA: "Saint Kitts and Nevis",
    KOR: "Korea (Republic of)",
    KWT: "Kuwait",
    LAO: "Lao People's Democratic Republic",
    LBN: "Lebanon",
    LBR: "Liberia",
    LBY: "Libya",
    LCA: "Saint Lucia",
    LIE: "Liechtenstein",
    LKA: "Sri Lanka",
    LSO: "Lesotho",
    LTU: "Lithuania",
    LUX: "Luxembourg",
    LVA: "Latvia",
    MAC: "Macao",
    MAF: "Saint Martin (French part)",
    MAR: "Morocco",
    MCO: "Monaco",
    MDA: "Moldova (Republic of)",
    MDG: "Madagascar",
    MDV: "Maldives",
    MEX: "Mexico",
    MHL: "Marshall Islands",
    MKD: "North Macedonia",
    MLI: "Mali",
    MLT: "Malta",
    MMR: "Myanmar",
    MNE: "Montenegro",
    MNG: "Mongolia",
    MNP: "Northern Mariana Islands",
    MOZ: "Mozambique",
    MRT: "Mauritania",
    MSR: "Montserrat",
    MTQ: "Martinique",
    MUS: "Mauritius",
    MWI: "Malawi",
    MYS: "Malaysia",
    MYT: "Mayotte",
    NAM: "Namibia",
    NCL: "New Caledonia",
    NER: "Niger",
    NFK: "Norfolk Island",
    NGA: "Nigeria",
    NIC: "Nicaragua",
    NIU: "Niue",
    NLD: "Netherlands",
    NOR: "Norway",
    NPL: "Nepal",
    NRU: "Nauru",
    NZL: "New Zealand",
    OMN: "Oman",
    PAK: "Pakistan",
    PAN: "Panama",
    PCN: "Pitcairn",
    PER: "Peru",
    PHL: "Philippines",
    PLW: "Palau",
    PNG: "Papua New Guinea",
    POL: "Poland",
    PRI: "Puerto Rico",
    PRK: "Korea (Democratic People's Republic of)",
    PRT: "Portugal",
    PRY: "Paraguay",
    PSE: "Palestine, State of",
    PYF: "French Polynesia",
    QAT: "Qatar",
    REU: "Réunion",
    ROU: "Romania",
    RUS: "Russian Federation",
    RWA: "Rwanda",
    SAU: "Saudi Arabia",
    SDN: "Sudan",
    SEN: "Senegal",
    SGP: "Singapore",
    SGS: "South Georgia and the South Sandwich Islands",
    SHN: "Saint Helena, Ascension and Tristan da Cunha",
    SJM: "Svalbard and Jan Mayen",
    SLB: "Solomon Islands",
    SLE: "Sierra Leone",
    SLV: "El Salvador",
    SMR: "San Marino",
    SOM: "Somalia",
    SPM: "Saint Pierre and Miquelon",
    SRB: "Serbia",
    SSD: "South Sudan",
    STP: "Sao Tome and Principe",
    SUR: "Suriname",
    SVK: "Slovakia",
    SVN: "Slovenia",
    SWE: "Sweden",
    SWZ: "Eswatini",
    SXM: "Sint Maarten (Dutch part)",
    SYC: "Seychelles",
    SYR: "Syrian Arab Republic",
    TCA: "Turks and Caicos Islands",
    TCD: "Chad",
    TGO: "Togo",
    THA: "Thailand",
    TJK: "Tajikistan",
    TKL: "Tokelau",
    TKM: "Turkmenistan",
    TLS: "Timor-Leste",
    TON: "Tonga",
    TTO: "Trinidad and Tobago",
    TUN: "Tunisia",
    TUR: "Turkey",
    TUV: "Tuvalu",
    TWN: "Taiwan, Province of China",
    TZA: "Tanzania, United Republic of",
    UGA: "Uganda",
    UKR: "Ukraine",
    UMI: "United States Minor Outlying Islands",
    URY: "Uruguay",
    USA: "United States of America",
    UZB: "Uzbekistan",
    VAT: "Holy See",
    VCT: "Saint Vincent and the Grenadines",
    VEN: "Venezuela (Bolivarian Republic of)",
    VGB: "Virgin Islands (British)",
    VIR: "Virgin Islands (U.S.)",
    VNM: "Viet Nam",
    VUT: "Vanuatu",
    WLF: "Wallis and Futuna",
    WSM: "Samoa",
    YEM: "Yemen",
    ZAF: "South Africa",
    ZMB: "Zambia",
    ZWE: "Zimbabwe",

}