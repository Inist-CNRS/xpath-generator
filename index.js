/*const FromXml = require('./lib/FromXml');
let xml = new FromXml().generate().then(results=>{
  for (var path in results){
    console.log(`${path} ${results[path].count}`)
  }
});*/

const FromFolder = require('./lib/FromFolder');
let xml = new FromFolder().generateAll().then((results)=>{
  for (var path in results) {
    console.log(`${'│  '.repeat(results[path].level)}├── ${path} ${results[path].count}`);
    //console.log(`${path} ${results[path].count} ${results[path].level}` )
  }
});

