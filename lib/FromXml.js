/**
 * Created by dieudonn on 24/10/2016.
 */

var Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));

class FromXml {
  constructor(){
    // Maybe default things to do here ?
  }
  loadFile(xmlPath = '../test/sample.xml'){
    return fs.readFileAsync(xmlPath).catch(function (err) {
      console.error(err);
    })
  }
}

module.exports = FromXml;
