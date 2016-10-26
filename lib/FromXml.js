'use strict';
const Promise = require('bluebird'),
      cheerio = Promise.promisifyAll(require('cheerio')),
      path = require('path'),
      kuler = require('kuler'),
      fs = Promise.promisifyAll(require('fs'));

class FromXml {
  constructor(){
    this._count = {};
    this._cheerio_opts = {
      normalizeWhitespace: true,
      xmlMode: true
    };
  }

  loadFile(xmlPath = 'samples/small/nature-file-test.xml'){
    return fs.readFileAsync(xmlPath, 'utf-8')
    .catch(err => {
      console.error(`Error: ${err} cannot open file`);
    })
  }

  parse(element, level = 0, parents = ''){
    parents = `${parents}/${element[0].name}`;
     this._count[parents] = this._count[parents] ? { count : this._count[parents].count+1 , level : level} : {count : 1, level:level};
     if(element.children().length){
       element.children().each((i,elem) => {
         this.parse(this._$(elem), level+1, parents);
       });
     }
  }
  // This method load file, parse & write result
  generate(xmlPath){
    return this.loadFile(xmlPath).then(data=>{
      return cheerio.load(data,this._cheerio_opts);
    })
    .then($=>{
      this._$ = $;
      return this.parse($.root().children());
    })
    .then(()=>{
      return this._count;
    })
  }
}

module.exports = FromXml;
