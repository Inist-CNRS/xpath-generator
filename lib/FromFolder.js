const Promise = require('bluebird'),
      path = require('path'),
      kuler = require('kuler'),
      cheerio = Promise.promisifyAll(require('cheerio')),
      fs = Promise.promisifyAll(require('fs')),
      FromXml = require('./FromXml.js');

class FromFolder extends FromXml{
  constructor(){
    super();
  }
  loadFolder(xmlFolder = 'samples/small'){
    xmlFolder = path.resolve(xmlFolder);
    return fs.readdirAsync(xmlFolder)
    .then(files => {
      return files.filter((file) =>{
        return file.substr(-4) === '.xml';
      })
    })
  }
  generate(xmlFolder){
    this.loadFolder(xmlFolder = 'samples/small')
    .map(file =>{
      return this.loadFile(path.resolve(xmlFolder,file));
    })
    .map(data =>{
      return cheerio.load(data,this._cheerio_opts);
    })
    .map($ =>{
      this._$ = $;
      this.parse($.root().children());
    })
    .then(()=>{
      console.log(kuler('Traitement sur le dossier terminé','green'));
    })
  }
}
module.exports = FromFolder;