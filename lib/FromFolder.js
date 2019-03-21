'use strict';

const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const FromXml = require('./FromXml.js');

class FromFolder extends FromXml {
  loadFolder (xmlFolder = 'samples/', patern = ['.xml']) {
    xmlFolder = path.resolve(xmlFolder);
    return fs.readdirAsync(xmlFolder).then(files => {
      return files.filter((file) => {
        return patern.includes(file.substr(-4));
      });
    });
  }

  generateAll (xmlFolder, patern) {
    return this.loadFolder(xmlFolder, patern).map(file => {
      return this.generate(path.resolve(xmlFolder, file), false);
    }).then((results) => {
      return results[0];
    });
  }
}

module.exports = FromFolder;
