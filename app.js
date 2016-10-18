"use strict";

const expat = require('node-expat');
const _ = require('lodash');
const parser = new expat.Parser('UTF-8');
const fs = require('fs');

const data = fs.readFileSync('nature-file-test.xml', 'utf8');

const arrData = [];
const mapResults = [];

parser.on('startElement', function (name, attrs) {
  const attributes = [];
  let attributeXpath = '';
  const keys = Object.keys(attrs);
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      attributes.push('@' + keys[i] + "='" + attrs[keys[i]] + "'")
    }
    attributeXpath = '[' + attributes.join(' and ') + ']';
  }

  arrData.push(name);
  const xpath = arrData.join('/') + attributeXpath;
  console.log(xpath);

  const getResult = _.find(mapResults, {'xpath': xpath});
  const haveResult = _.isObject(getResult);
  if (haveResult) {
    getResult.count++
  } else {
    mapResults.push({
      xpath: xpath,
      count: 1
    });
  }

  // console.log(mapResults);
});

parser.on('endElement', function () {
  arrData.pop();
});

parser.on('error', function (error) {
  console.error(error)
});

parser.write(data);
// parser.write('<html><head><title>Hello World</title></head><body><p>Foobar</p></body></html>')
