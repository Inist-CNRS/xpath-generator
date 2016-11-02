'use strict';

const chai = require('chai'),
      expect = chai.expect,
      fs = require('fs'),
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
})
describe('Unit error tests on Methods', () => {
  it('Should throw an Error if path not send',(done)=>{
    expect(xml.loadFile).to.throw(Error);
    done();
  })
  it('Should return an Error if path is not a file',()=>{
    return xml.loadFile('test/test.xml').catch(err=>{
      expect(err).to.not.be.empty;
    })
  })
  it('Should throw an Error if data not send',(done)=>{
    expect(xml.loadData).to.throw(Error);
    done();
  })
  it('Should throw an Error if parse is call without args',(done)=>{
    expect(xml.parse).to.throw(Error);
    done();
  })
})
describe('Unit valid test on Methods', () => {
  var xmlFile = fs.readFileSync('samples/test.xml','utf-8');
  it('Should return a valid cheerio $', () => {
    let $ = xml.loadData(xmlFile)
    expect($()).to.be.a('object');
    expect($.root().children()).to.be.a('object')
    expect($.root().children()).to.have.length.above(0)
  })
})
describe('Test on an simple xml', () => {
  it('Should use params & return obj', ()=> {
    return xml.loadFile('samples/test.xml').then(file=>{
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
  })
  it('Should not clear count if option is set to false', ()=>{
    return xml.generate('./samples/test.xml',false).then(result=> {
      expect(xml._count).to.be.an('object');
      expect(xml._count).to.not.be.empty;
    });
  })
  it('Should clear count if option is set to true', ()=>{
    return xml.generate('./samples/test.xml',true).then(result=> {
      expect(xml._count).to.be.an('object');
      expect(xml._count).to.be.empty;
    });
  })
  //Attention here comparing value, make sure test cleaning to true was done just before
  it('Should Generate an obj from xml file from generate method', ()=>{
    return xml.generate('./samples/test.xml',true).then(result=> {
      let firstKeyToCompare  = Object.keys(result)[0],
          firstValueToCompare = result[Object.keys(result)[0]];
      expect(firstKeyToCompare).to.equal(firstKeyToCheck);
      expect(firstValueToCompare).to.deep.equal(firstValueToCheck);
    });
  })
  
})