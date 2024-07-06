const headers = ['Name','Cost','Power','Description','Source', 'Date'];

let sortOrder = {};

function getSourceValue(source) {
    switch (source) {
        case 'Pool 1 (Collection Level 18-214)':
            return 1;
        case 'Pool 2 (Collection Level 222-486)':
            return 2;
        case 'Pool 3 (Collection Level 486-?)':
            return 3;
        case 'Pool 4 (Series 4)':
            return 4;
        case 'Pool 5 (Series 5)':
            return 5;
        case 'Collection Level 1-14':
            return 0;
        case 'Starter Card':
            return -1;
        case 'Recruit Season':
            return -2;
        case 'None':
            return 5;
        default:
            return 0;
    }
}

function createTable(cards) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        th.onclick = () => {
            const key = header.toLowerCase();
            sortOrder[key] = !sortOrder[key]; // Toggle the sort order
            sortTable(table, key, sortOrder[key]);
        };
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    cards.forEach(card => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${card.name}</td>
            <td>${card.cost}</td>
            <td>${card.power}</td>
            <td>${cards[card.name.toLowerCase()].description}</td>
            <td value='${getSourceValue(card.source)}'>${card.source}</td>
            <td value='${card.date}'>${card.dateStr}</td>

        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}

function sortTable(table, key, ascending) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    let compare;

     if (key === 'date' || key === "source") {
        console.log("here")
        compare = (a, b) => {
            const valA = parseInt(a.cells[headers.indexOf(key.charAt(0).toUpperCase() + key.slice(1))].getAttribute('value'));
            const valB = parseInt(b.cells[headers.indexOf(key.charAt(0).toUpperCase() + key.slice(1))].getAttribute('value'));
            console.log(valA)
            console.log(valB)
            return ascending ? valA - valB : valB - valA;
        };
    } else {
        compare = (a, b) => {
            const valA = a.cells[headers.indexOf(key.charAt(0).toUpperCase() + key.slice(1))].innerText;
            const valB = b.cells[headers.indexOf(key.charAt(0).toUpperCase() + key.slice(1))].innerText;
            return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        };
    }

    rows.sort(compare);
    rows.forEach(row => tbody.appendChild(row));
}

console.log(Object.keys(j.collectionhist).length)

var collection = new Map();

for (const [key, value] of Object.entries(j.collection)) {
    collection.set(key, {
        name: cards[key.toLowerCase()].name,
        source: cards[key.toLowerCase()].source,
        cost: cards[key.toLowerCase()].cost,
        power: cards[key.toLowerCase()].power,
        dateStr: new Date().toUTCString().replace(",", ""),
        date: Math.trunc(new Date().getTime() / 1000),
        updated: false
    })
}

for (const [key, value] of Object.entries(j.collectionhist)) {
    var d = new Date(value[0].date * 1000)

    collection.set(key, {
        name: cards[key.toLowerCase()].name,
        source: cards[key.toLowerCase()].source,
        cost: cards[key.toLowerCase()].cost,
        power: cards[key.toLowerCase()].power,
        dateStr: d.toUTCString().replace(",", ""),
        date: Math.trunc(d / 1000),
        updated: true
    }
    )
}

var owned_cards = []
for (const [key, value] of collection) {
    owned_cards.push({
        name: value.name,
        dateStr: value.dateStr,
        date: value.date,
        cost: value.cost,
        power: value.power,
        source: value.source,
        updated: value.updated
    })

}

const table = createTable(owned_cards);
document.getElementById('cards').appendChild(table);