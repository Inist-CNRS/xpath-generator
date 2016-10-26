const program = require('commander'),
      version = require('./package.json').version,
      FromXml = require('./lib/FromXml'),
      FromFolder = require('./lib/FromFolder');

// Cli config
program
.version(version)
.usage('[options] <file ...>')
.option('-i, --input <path>', 'An xml input file')
.option('-f, --folder <path>', 'A folder containing xml files')
.parse(process.argv);

// No option provided , show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

//Start cli on folder
if(program.folder){
  console.log(program.folder);
  return;
}

// Start Cli on File
if(program.input){
  console.log(program.input);
  return;
}


/*const FromXml = require('./lib/FromXml');
let xml = new FromXml().generate().then(results=>{
  for (var path in results){
    console.log(`${path} ${results[path].count}`)
  }
});*/

/*const FromFolder = require('./lib/FromFolder');
let xml = new FromFolder().generateAll().then((results)=>{
  for (var path in results) {
    console.log(`${'│  '.repeat(results[path].level)}├── ${path} ${results[path].count}`);
    //console.log(`${path} ${results[path].count} ${results[path].level}` )
  }
});*/

