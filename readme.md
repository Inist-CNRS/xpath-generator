Xpath-Generator
=====

Node script (API & CLI) that can generate a tree or xpaths, group & count them.

##CLI :
```sh
npm i -g xpath-generator
```

Then : 
```sh
xpath-generator -f /folder/ -o /output
```

##Install :
```sh
npm i -save xpath-generator
```

Load it :

```js
const FromXML = require('xpath-generator').FromXML,
      FromFolder = require('xpath-generator').FromFolder;     
```

Use it :
```js
let xml = new FromXml().generate('path/to/XML').then(result=> {
  for (var key in result) {
    console.log(`${path} ${result[path].count}`);
  }
});
let xmls = new FromFolder().generateAll(program.folder).then(result=> {
  for (var key in result) {
    console.log(`${path} ${result[path].count}`);
  }
});
```   

Result will return something like 

```js
[{
  '/path/number/1' : {
    count : n,
    level : n
  }
},{
  '/path/number/2' : {
    count : n,
    level : n
  }
}]
```


### Options

#### File : 

#### Folder :
Output option can be : 

- console
- a path, ex './' without xml name 

Type option can be :

- xpaths
- tree
- both, only work with path output, not console

