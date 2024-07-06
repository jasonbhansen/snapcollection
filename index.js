const headers = ['Name', 'DateStr', 'Source', 'Updated'];

function createTable(cards) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        th.onclick = () => sortTable(table, header.toLowerCase());
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    cards.forEach(card => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${card.name}</td>
            <td>${card.dateStr}</td>
            <td>${card.source}</td>
            <td>${card.updated}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}

function sortTable(table, key) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    let compare;

    if (key === 'date' || key === 'updated') {
        compare = (a, b) => {
            const valA = key === 'date' ? new Date(a.cells[1].innerText) : a.cells[3].innerText === 'true';
            const valB = key === 'date' ? new Date(b.cells[1].innerText) : b.cells[3].innerText === 'true';
            return valA > valB ? 1 : -1;
        };
    } else {
        compare = (a, b) => a.cells[headers.indexOf(key.charAt(0).toUpperCase() + key.slice(1))].innerText.localeCompare(b.cells[headers.indexOf(key.charAt(0).toUpperCase() + key.slice(1))].innerText);
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
        source: value.source,
        updated: value.updated
    })

    console.log(`${value.name},${value.dateStr},${value.date},${value.source},${value.updated}`);
}

const table = createTable(owned_cards);
document.getElementById('cards').appendChild(table);