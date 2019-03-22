#!/usr/bin/env node
'use strict';
const program = require('commander');
const version = require('./package.json').version;
const FromXml = require('./lib/FromXml');
const fs = require('fs');
const path = require('path');
const FromFolder = require('./lib/FromFolder');

// Cli config
program
  .version(version)
  .usage('[options] <file ...>')
  .option('-a, --attributes', 'Will return all attributes & uniques values for all paths')
  .option('-i, --input <path>', 'An xml input file')
  .option('-f, --folder <path>', 'A folder containing xml files')
  .option('-e, --extension <ext1 ext2 ext3 ...>', 'A list of entension for folder files to be read, .xml is default')
  .option('-o, --output <path>', 'Generate files to specific path, default is console')
  .option('-t, --type <tree/xpaths/both>', 'Type of format output, can be tree/xpaths or both for outputdir, tree/xpaths for console')
  .option('-n, --nbattvalues <n>', 'Number of attribute values to output (see -a)', 10)
  .parse(process.argv);

// No option provided , show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// Make results available globally
let results;

// Start Cli on File
if (program.input) {
  const xml = new FromXml();
  xml.generate(program.input, true, program.nbattvalues).then(result => {
    results = result;
    const action = actionsToDo();
    for (let key in result) {
      action(key);
    }
  }).catch(err => {
    console.error('An error came : ', err);
  });
}
// Start Cli on Folder
if (program.folder) {
  const xmls = new FromFolder();
  xmls.generateAll(program.folder, program.extension).then(result => {
    results = result;
    const action = actionsToDo();
    for (let key in result) {
      action(key);
    }
  });
}

function actionsToDo () {
  if (!program.output || program.output === 'console') {
    if (program.type === 'xpaths') {
      return function (path) {
        const nbOfAttr = program.attributes ? Object.keys(results[path].attributes).length : 0;
        console.log(`${path} ${results[path].countElement} ${nbOfAttr ? JSON.stringify(results[path].attributes) : ''}`);
      };
    }
    // tree
    return function (path) {
      const elements = path.split('/');

      const elementName = elements[elements.length - 1];
      const nbOfAttr = program.attributes ? Object.keys(results[path].attributes).length : 0;
      console.log(`${'│  '.repeat(results[path].level)}├── ${elementName} ${results[path].countElement} ${nbOfAttr ? JSON.stringify(results[path].attributes) : ''}`);
    };
  } else {
    let xpathsFile, treeFile;
    if (!program.output) {
      console.error('error no output specified');
      process.exit(0);
    }
    if (program.type === 'xpaths') {
      xpathsFile = writeStream('xpaths', program.output, 'csv');
      return function (path) {
        const nbOfAttr = program.attributes ? Object.keys(results[path].attributes).length : 0;
        xpathsFile.write(`${path};${results[path].countElement};${nbOfAttr ? JSON.stringify(results[path].attributes) : ''}\n`);
      };
    }
    if (program.type === 'tree') {
      treeFile = writeStream('tree', program.output, 'txt');
      return function (path) {
        const nbOfAttr = program.attributes ? Object.keys(results[path].attributes).length : 0;
        treeFile.write(`${'│  '.repeat(results[path].level)}├── ${path} ${results[path].countElement} ${nbOfAttr ? JSON.stringify(results[path].attributes) : ''}\n`);
      };
    }
    // both
    xpathsFile = writeStream('xpaths', program.output, 'csv');
    treeFile = writeStream('tree', program.output, 'txt');
    return function (path) {
      const nbOfAttr = program.attributes ? Object.keys(results[path].attributes).length : 0;
      xpathsFile.write(`${path};${results[path].countElement};${nbOfAttr ? JSON.stringify(results[path].attributes) : ''}\n`);
      treeFile.write(`${'│  '.repeat(results[path].level)}├── ${path} ${results[path].countElement} ${nbOfAttr ? JSON.stringify(results[path].attributes) : ''}\n`);
    };
  }
}

function writeStream (type, output, extension) {
  const stream = fs.createWriteStream(path.resolve(output, `output-${type}.${extension}`), { 'flags': 'w' });
  stream.on('error', (err) => {
    throw new Error(err);
  });
  return stream;
}
