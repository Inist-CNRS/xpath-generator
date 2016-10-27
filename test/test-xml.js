'use strict';

const chai = require('chai'),
      expect = chai.expect,
      FromXml = require('../lib/FromXml'),
      FromFolder = require('../lib/FromFolder');

const xml = new FromXml();
var firstValueToCheck,firstKeyToCheck;

describe('Default XML Class instance params', () => {
  it('Should init new Classes instance with default params', ()=> {

    expect(xml._count).to.be.a('object');
    expect(xml._count).to.be.empty;

    expect(xml._cheerio_opts).to.be.a('object');
    expect(xml._cheerio_opts).to.have.property('normalizeWhitespace', true);
    expect(xml._cheerio_opts).to.have.property('xmlMode', true);

  });
  it('Should use default es6 params when no args & return obj', ()=> {
    return xml.loadFile().then(file=>{
      expect(file).to.be.a('string');
      return xml.loadData(file);
    })
    .then(data =>{
      expect(data).to.be.a('function');
      return xml.parse(data,data.root().children());
    })
    .then(()=>{
      expect(xml._count).to.be.a('object');

      //Usefull to compare if generate() return the same as above
      firstKeyToCheck  = Object.keys(xml._count)[0];
      firstValueToCheck = xml._count[Object.keys(xml._count)[0]];

      //Reset xmlcount for next test
      xml._count= {};
    });
  });
  it('Should generate an obj from xml file', ()=>{
    return xml.generate('./samples/test.xml').then(result=> {
      let firstKeyToCompare  = Object.keys(result)[0],
          firstValueToCompare = result[Object.keys(result)[0]];

      expect(firstKeyToCompare).to.equal(firstKeyToCheck);
      expect(firstValueToCompare).to.deep.equal(firstValueToCheck);
    });
  })
});