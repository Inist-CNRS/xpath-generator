'use strict';
const Promise = require('bluebird'),
      cheerio = Promise.promisifyAll(require('cheerio')),
      path = require('path'),
      kuler = require('kuler'),
      fs = Promise.promisifyAll(require('fs'));

class FromXml {
  constructor(output='console',type='xpaths'){
    this._output = output;
    this._type = type;
    this.live = live;
    this._count = {};
    this._cheerio_opts = {
      normalizeWhitespace: true,
      xmlMode: true
    };
    if(this._output === 'console'){
      this.action = (this._type === 'tree') ? this.showLiveTree : this.showLiveXpaths;
    }
    else{
      // Flag a means write stream or append in it if already exists
      let options_flags = {'flags': 'a'};
      switch (this._type){
        case 'both':
          this.action = this.writeLiveAll;
          this._xpaths = fs.createWriteStream(path.resolve(output,'output-xpaths.xml'),options_flags);
          this._tree = fs.createWriteStream(path.resolve(output,'output-tree.xml'),options_flags);
          break;
        case 'tree':
          this.action = this.writeLiveTree;
          this._tree = fs.createWriteStream(path.resolve(output,'output-tree.xml'),options_flags);
          break;
        case 'xpaths':
          this.action = this.writeLiveXpaths;
          this._xpaths = fs.createWriteStream(path.resolve(output,'output-xpaths.xml'),options_flags);
          break;
        default:
          this.action = this.writeLiveAll;
          this._xpaths = fs.createWriteStream(path.resolve(output,'output-xpaths.xml'),options_flags);
          this._tree = fs.createWriteStream(path.resolve(output,'output-tree.xml'),options_flags);
          break;
      }
    }
  }

  loadFile(xmlPath = 'samples/small/nature-file-test.xml'){
    return fs.readFileAsync(xmlPath, 'utf-8')
    .catch(err => {
      console.error(`Error: ${err} cannot open file`);
    })
  }

  parse(element, level = 0, parents = ''){
    parents = `${parents}/${element[0].name}`;
     this.action(element,parents,level);
     this._count[parents] = this._count[parents] ? ++this._count[parents] : 1;
     if(element.children().length){
       element.children().each((i,elem) => {
         this.parse(this._$(elem), ++level, parents);
       });
     }
  }

  showLiveTree(element,parents,level){
    console.log(`${'│  '.repeat(level)}├── ${element[0].name}`);
  }
  showLiveXpaths(element,parents){
    //console.log(`${parents}`);
  }
  writeLiveTree(element,parents,level){
    this._tree.write(`${'│  '.repeat(level)}├── ${element[0].name}\n`);
  }
  writeLiveXpaths(element,parents){
    this._xpaths.write(`${parents}\n`)
  }
  writeLiveAll(element,parents,level){
    this.writeXpaths(element,parents,level);
    this.writeTree(element,parents,level);
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
