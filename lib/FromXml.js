'use strict';
const Promise = require('bluebird'),
  cheerio = Promise.promisifyAll(require('cheerio')),
  path = require('path'),
  fs = Promise.promisifyAll(require('fs'));

class FromXml {
  constructor() {
    this._count = {};
    this._cheerio_opts = {
      normalizeWhitespace: true,
      xmlMode: true
    };
  }

  loadFile(xmlPath = 'samples/test.xml') {
    return fs.readFileAsync(xmlPath, 'utf-8').catch(err => {
      console.error(`Error: ${err} cannot open file`);
    })
  }

  loadData(data = '<base></base>', cheerio_opts = this._cheerio_opts) {
    return cheerio.load(data, cheerio_opts);
  }

  parse($, element, level = 0, parents = '') {
    parents = `${parents}/${element[0].name}`;
    this._count[parents] = this._count[parents] ? {count: this._count[parents].count + 1, level: level} : {
      count: 1,
      level: level
    };
    if (element.children().length) {
      element.children().each((i, elem) => {
        this.parse($, $(elem), level + 1, parents);
      });
    }
  }

  // This method load file, parse & write result
  generate(xmlPath, clean = true) {
    return this.loadFile(xmlPath).then(data=> {
      return this.loadData(data, this._cheerio_opts);
    }).then($=> {
      this._$ = $;
      return this.parse(this._$, $.root().children());
    }).then(()=> {
      let count = this._count;
      if (clean) {
        this._count = {};
      }
      return count;
    })
  }
}

module.exports = FromXml;
