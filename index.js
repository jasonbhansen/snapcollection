const headers = ['Name', 'Cost', 'Power', 'Description', 'Source', 'Date'];

const ignore_list = ['acidarrow', 'basicarrow', 'chimichanga', 'widowsbite', 'widowskiss', 'wintersoldier', 'mysterioillusion']

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

function getSourceLabel(source) {
    switch (source) {
        case 'Pool 1 (Collection Level 18-214)':
            return 'Pool 1';
        case 'Pool 2 (Collection Level 222-486)':
            return 'Pool 2';
        case 'Pool 3 (Collection Level 486-?)':
            return 'Pool 3';
        case 'Pool 4 (Series 4)':
            return 'Pool 4';
        case 'Pool 5 (Series 5)':
            return 'Pool 5';
        case 'Collection Level 1-14':
            return 'Level 1-14';
        case 'Starter Card':
            return 'Starter Card';
        case 'Recruit Season':
            return 'Recruit Season';
        case 'None':
            return 'Pool 5';
        default:
            return '';
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
            <td>${card.description}</td>
            <td value='${getSourceValue(card.source)}'>${getSourceLabel(card.source)}</td>
            <td value='${card.date}'>${card.dateStr}</td>

        `;
        tbody.appendChild(row);
    });



    table.appendChild(tbody);
    table.id = 'cards-table';
    sortTable(table, "Name", true);
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

function filterTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.querySelector('table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const nameCell = cells[0];
        const descriptionCell = cells[3];
        if (nameCell && descriptionCell) {
            const nameValue = (nameCell.textContent || nameCell.innerText).toLowerCase();
            const descriptionValue = (descriptionCell.textContent || descriptionCell.innerText).toLowerCase();
            rows[i].style.display = nameValue.indexOf(filter) > -1 || descriptionValue.indexOf(filter) > -1 ? '' : 'none';
        }
    }
}

function findSmallestDate(data) {
    if (!data || data.length === 0) return null;
    return data.reduce((smallest, current) => {
        return current.date < smallest ? current.date : smallest;
    }, data[0].date);
}

function adjustChartWidth() {
    const table = document.getElementById('cards-table');
    const chartContainer = document.getElementById('rank-chart-container-id');
    chartContainer.style.width = `${table.offsetWidth}px`;
}

function createGaugeChart(ctx, value, label, maxValue) {
    // setup
    const data = {
        labels: ["Owned", "Not Owned"],
        datasets: [
            {
                label: label,
                data: [value, maxValue - value],
                backgroundColor: [
                    "#FFD700",
                    "#2E2965",
                ],
                needleValue: value,
                borderColor: "white",
                borderWidth: 0,
                cutout: "95%",
                circumference: 180,
                rotation: 270,
            },
        ],
    };
    const config = {
        type: "doughnut",
        data,
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    yAlign: "bottom",
                    displayColors: false
                },
            },
        },
    };

    new Chart(ctx, config);
}

function createRankChart(ctx, data){
    data = data.filter((e, i) => i % 2 == 0);
    const labels = data.map(d => new Date(d.date * 1000).toLocaleDateString());
    const rankData = data.map(d => d.Rank);
    const gamesPlayedData = data.map(d => d.GamesPlayedInSeason);
    
    // Create the chart
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                type: 'line',
                label: 'Rank',
                data: rankData,
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                borderWidth: 2,
                pointRadius: 1,
                yAxisID: 'y-axis-rank'
            }, {
                type: 'bar',
                label: 'Games Played In Season',
                data: gamesPlayedData,
                backgroundColor: '#1E90FF',
                borderWidth: 1,
                yAxisID: 'y-axis-games'
            }]
        },
        options: {
            animation: false,
            scales: {
                maintainAspectRatio: false,
                responsive: true,
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 14
                        },
                        color: '#FFFFFF'
                    }
                },
                'y-axis-rank': {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 14
                        },
                        color: '#FFFFFF'
                    },
                    title: {
                        display: true,
                        text: 'Rank',
                        font: {
                            size: 16
                        },
                        color: '#FFFFFF'
                    }
                },
                'y-axis-games': {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 14
                        },
                        color: '#FFFFFF'
                    },
                    title: {
                        display: true,
                        text: 'Games Played In Season',
                        font: {
                            size: 16
                        },
                        color: '#FFFFFF'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16
                        },
                        color: '#FFFFFF'
                    }
                }
            }
        }
    });

}

function process_cards(){
    
    var collection = new Map();
    var totalsOwned = new Map();
    var totals = new Map();
    
    for (const [key, value] of Object.entries(j.collection)) {
        var d = new Date()
    
        collection.set(key, {
            name: cards[key.toLowerCase()].name,
            source: cards[key.toLowerCase()].source,
            cost: cards[key.toLowerCase()].cost,
            power: cards[key.toLowerCase()].power,
            description: cards[key.toLowerCase()].description,
            dateStr: d.toLocaleDateString(),
            date: Math.trunc(d),
            updated: false
        })
    
        var source = getSourceLabel(cards[key.toLowerCase()].source)
        if (cards[key.toLowerCase()].is_Token === "0" && !ignore_list.includes(key.toLowerCase()) && Object.keys(cards[key.toLowerCase()]).includes("stats_winrate")) {
            if (totalsOwned.has(source))
                totalsOwned.set(source, totalsOwned.get(source) + 1)
            else
                totalsOwned.set(source, 1)
        }
    
    
    }
    
    for (const [key, value] of Object.entries(j.collectionhist)) {
    
        var d = new Date(findSmallestDate(j.collectionhist[key]) * 1000)
    
        collection.set(key, {
            name: cards[key.toLowerCase()].name,
            source: cards[key.toLowerCase()].source,
            cost: cards[key.toLowerCase()].cost,
            power: cards[key.toLowerCase()].power,
            description: cards[key.toLowerCase()].description,
            dateStr: d.toLocaleDateString(),
            date: Math.trunc(d),
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
            description: value.description,
            source: value.source,
            updated: value.updated
        })
    
    }
    
    var all_cards_map = new Map();
    
    for (const [key, value] of Object.entries(cards)) {
    
        if (value.is_Token === "0" && !ignore_list.includes(key.toLowerCase()) && Object.keys(value).includes("stats_winrate")) {
            let source = getSourceLabel(value.source);
            if (totals.has(source)){ 
                totals.set(source, totals.get(source) + 1)
                all_cards_map.get(source).push(value.name)
            } else {
                totals.set(source, 1)
                all_cards_map.set(source, [value.name])
            }
        }
    }
    
    owned_cards.forEach( card => {
        var source = getSourceLabel(card.source);
        all_cards_map.set(source,all_cards_map.get(source).filter(x => x != card.name));
    })
    
    return {owned_cards, all_cards_map}
}

function main() {

    var {owned_cards, all_cards_map} = process_cards();
    
    console.log(all_cards_map)
    
    createGaugeChart(document.getElementById('pool3Gauge'), totalsOwned.get('Pool 3'), 'Pool 3 Cards', totals.get('Pool 3'));
    createGaugeChart(document.getElementById('pool4Gauge'), totalsOwned.get('Pool 4'), 'Pool 4 Cards', totals.get('Pool 4'));
    createGaugeChart(document.getElementById('pool5Gauge'), totalsOwned.get('Pool 5'), 'Pool 5 Cards', totals.get('Pool 5'));
    
    document.getElementById('pool3Percent').innerText = `${Math.trunc(100 * totalsOwned.get('Pool 3') / totals.get('Pool 3'))}%`;
    document.getElementById('pool4Percent').innerText = `${Math.trunc(100 * totalsOwned.get('Pool 4') / totals.get('Pool 4'))}%`;
    document.getElementById('pool5Percent').innerText = `${Math.trunc(100 * totalsOwned.get('Pool 5') / totals.get('Pool 5'))}%`;
    
    
    const table = createTable(owned_cards);
    document.getElementById('cards').getElementsByClassName("container")[0].appendChild(table);
    
    createRankChart(document.getElementById('rankGamesChart').getContext('2d'), j.rankhistory)

    document.getElementById('searchInput').addEventListener('keyup', filterTable);
    window.addEventListener('resize', adjustChartWidth);
    window.addEventListener('load', adjustChartWidth);
    adjustChartWidth();
}

main();


