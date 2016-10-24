const cherrio = require('cheerio'),
      fs = require('fs'),
      file = fs.readFileSync('./nature-file-test.xml');

const $ = cherrio.load(file, {
    normalizeWhitespace: true,
    xmlMode: true
});

const tree = fs.createWriteStream('tree.txt'),
      xpaths = fs.createWriteStream('xpaths.txt');

function scrawl(element = $.root().children(), level = 0, parents = '') {
  parents = `${parents}/${element[0].name}`;
  console.log($(element).attr());
  //tree.write(`${'│  '.repeat(level)}├── ${element[0].name}\n`);
  //xpaths.write(`${parents}\n`)
  console.log(`${'│  '.repeat(level)}├── ${element[0].name}`);
  console.log(`${parents}[${element.attr()}]`);
  if(element.children().length){
    element.children().each((i,elem) => {
      scrawl($(elem), level+1, parents);
    });
  }
};
scrawl();