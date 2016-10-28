const program = require('commander'),
  version = require('./package.json').version,
  FromXml = require('./lib/FromXml'),
  fs = require('fs'),
  path = require('path'),
  FromFolder = require('./lib/FromFolder');

// Cli config
program
  .version(version)
  .usage('[options] <file ...>')
  .option('-i, --input <path>', 'An xml input file')
  .option('-f, --folder <path>', 'A folder containing xml files')
  .option('-o, --output <path>', 'Generate files to specific path, default is console')
  .option('-t, --type <tree/xpaths/both>', 'Type of format output, can be tree/xpaths or both for outputdir, tree/xpaths for console')
  .parse(process.argv);

// No option provided , show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}


//Make results available globally
var results;

// Start Cli on File
if (program.input) {
  let xml = new FromXml().generate(program.input).then(result=> {
    results = result;
    var action = actionsToDo();
    for (var key in result) {
      action(key);
    }
  });
}
// Start Cli on Folder
if (program.folder) {
  let xmls = new FromFolder().generateAll(program.folder).then(result=> {
    results = result;
    var action = actionsToDo();
    for (var key in result) {
      action(key);
    }
  });
}

function actionsToDo() {

  if (program.output === 'console') {
    if (program.type === 'xpaths') {
      return function (path) {
        console.log(`${path} ${results[path].count}`)
      };
    }
    //tree
    return function (path) {
      console.log(`${'│  '.repeat(results[path].level)}├── ${path} ${results[path].count}`)
    };
  }
  // Write file , no output
  else {
    var xpathsFile, treeFile;
    if (!program.output) {
      console.error('error no output specified');
      process.exit(0)
    }
    if (program.type === 'xpaths') {
      xpathsFile = writeStream('xpaths', program.output);
      return function (path) {
        xpathsFile.write(`${path} ${results[path].count}\n`)
      }
    }
    if (program.type === 'tree') {
      treeFile = writeStream('tree', program.output);
      return function (path) {
        treeFile.write(`${'│  '.repeat(results[path].level)}├── ${path} ${results[path].count}\n`);
      }
    }
    //both
    xpathsFile = writeStream('xpaths', program.output);
    treeFile = writeStream('tree', program.output);
    return function (path) {
      xpathsFile.write(`${path} ${results[path].count}\n`)
      treeFile.write(`${'│  '.repeat(results[path].level)}├── ${path} ${results[path].count}\n`);
    }
  }
}

function writeStream(type, output) {
  let stream = fs.createWriteStream(path.resolve(output, `output-${type}.xml`), {'flags': 'w'});
  stream.on('error', (err)=> {
    throw new Error(err);
  });
  return stream;
}
