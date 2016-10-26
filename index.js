/*const FromXml = require('./lib/FromXml');
let xml = new FromXml().generate().then(results=>{
  for (var path in results){
    console.log(`${path} ${results[path]}`)
  }
});*/

const FromFolder = require('./lib/FromFolder');
let xml = new FromFolder().generateAll().then((result)=>{
  console.log(result);
});

