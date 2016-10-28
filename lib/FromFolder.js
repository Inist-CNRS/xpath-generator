'use strict';

const Promise = require('bluebird'),
  path = require('path'),
  cheerio = Promise.promisifyAll(require('cheerio')),
  fs = Promise.promisifyAll(require('fs')),
  FromXml = require('./FromXml.js');

class FromFolder extends FromXml {
  constructor() {
    super();
  }

  loadFolder(xmlFolder = 'samples/') {
    xmlFolder = path.resolve(xmlFolder);
    return fs.readdirAsync(xmlFolder).then(files => {
      return files.filter((file) => {
        return file.substr(-4) === '.xml';
      })
    })
  }

  generateAll(xmlFolder) {
    return this.loadFolder(xmlFolder).map(file => {
      return this.generate(path.resolve(xmlFolder, file), false);
    }).then((results) => {
      return results[0];
    })
  }
}

module.exports = FromFolder;