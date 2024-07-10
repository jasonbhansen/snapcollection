const { cards } = require("./cards")
const { j } = require("./me")


console.log(Object.keys(j.collectionhist).length)

var collection = new Map();
var totalsOwned = new Map();

for(const [key, value] of Object.entries(j.collection)){
    collection.set(key, { 
        name: cards[key.toLowerCase()].name,
        source: cards[key.toLowerCase()].source,
        dateStr: new Date().toUTCString().replace(",",""),
        date: Math.trunc(new Date().getTime() / 1000),
        updated: false
    })
    
}

for(const [key,value] of Object.entries(j.collectionhist)) {
    var d = new Date(value[0].date*1000)
    // console.log(cards[key.toLowerCase()])
    // console.log(`${cards[key.toLowerCase()].name}, ${d.toUTCString().replace(",","")}, ${value[0].date}, ${cards[key.toLowerCase()].source}`)
    // break;

    collection.set(key,{
        name: cards[key.toLowerCase()].name,
        source: cards[key.toLowerCase()].source,
        dateStr: d.toUTCString().replace(",",""),
        date: Math.trunc(d / 1000),
        updated: true
    }
    )
} 

for(const [ key, value] of Object.entries ())

console.log(collection)

for(const [key, value] of collection){

    console.log(`${value.name},${value.dateStr},${value.date},${value.source},${value.updated}`);
}
