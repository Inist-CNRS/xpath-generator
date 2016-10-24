/**
 * Created by dieudonn on 24/10/2016.
 */

const fromXml = require('./lib/FromXml');

let xml = new fromXml().loadFile('/Users/dieudonn/Documents/INIST/xpath-generator/sage-file-test.xm');

xml.then(function (file) {
  console.log(file)
});
