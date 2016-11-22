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

  loadFile(xmlPath) {
    if(!xmlPath){
      throw new Error('No xml path send')
    }
    return fs.readFileAsync(xmlPath, 'utf-8');
  }

  loadData(data, cheerio_opts = this._cheerio_opts) {
    if(!data){
      throw new Error('No data send to cheerio');
    }
    return cheerio.load(data, cheerio_opts);
  }

  parse($, element, level = 0, parents = '') {
    if(!($ && element)){
      throw new Error('Parse was called without args');
    }
    parents = `${parents}/${element[0].name}`;
    let currAttr = element.attr(),
        attributes = {};
    for(let attr in currAttr){
      attributes[attr] = [currAttr[attr]];
    }
    if(!this._count[parents]){
      this._count[parents] = { count: 1, level: level , attributes : attributes };
    }
    else{
      this._count[parents].count++;
      for(let attr in attributes){
        if(!this._count[parents].attributes.hasOwnProperty(attr)){
          this._count[parents].attributes[attr] = attributes[attr];
          return;
        }
        if(!this._count[parents].attributes[attr].includes(...attributes[attr])){
          this._count[parents].attributes[attr] = [...this._count[parents].attributes[attr],...attributes[attr]];
        }
      }
    }
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
      if(!($ && $.root() && $.root().children().length)){
        throw new Error('This is not an XML file, or is empty');
      }
      return this.parse(this._$, $.root().children());
    }).then(()=> {
      let count = this._count;
      // clean this._count when this class is used 'on the fly'
      if (clean) {
        this._count = {};
      }
      return count;
    })
  }
}

module.exports = FromXml;
