Xpath-Generator
=====

[![Build Status](https://travis-ci.org/Inist-CNRS/xpath-generator.svg?branch=master)](https://travis-ci.org/Inist-CNRS/xpath-generator)

Node script (API & CLI) that can generate a list of xpaths for XML files, group & count them, list attributes & values.

##### Tree view :
![Xpath-Tree](https://raw.githubusercontent.com/inist-CNRS/xpath-generator/master/xpath-tree-console.png)

##### List view:
![Xpath-List](https://raw.githubusercontent.com/inist-CNRS/xpath-generator/master/xpath-xpaths.png)

## CLI :
```sh
npm i -g xpath-generator
```

Then : 
```sh
xpath-generator -f /folder/ -o /output
```

### Folder information

If you want to lauch xpath-generator on a folder, please make sur all your XML are at the top level of our folder, xpath-generator will not go through subfolder to find them.

If your main folder contains nasted subfolders wich contains your xml (ex: /main/sub/ex.xml) please consider using 
[Sisyphe](https://github.com/istex/sisyphe)

### Help
```sh
xpath-generator --help
```

### Options

  -h, --help                     //output usage information
  
  -V, --version                  //output the version number
  
  -a, --attributes               //Will return all attributes & uniques values for all paths
  
  -i, --input <path>             //An xml input file
  
  -f, --folder <path>            //A folder containing xml files
  
  -o, --output <path>            //Generate files to specific path, default output is terminal
  
  -t, --type <tree/xpaths/both>  Type of format output, can be 'tree' 'xpaths' or 'both' for outputdir, 'tree' 'xpaths' for console


## Use xpath-generator as API :

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

Result will return an array of object like: 

```js
[
  {
    '/path/number/1' : {
      count : n,
      level : n,
      attributes: {
        attr1: ['a','list','of','distinct','values','for','attr1'],
        attr2,
        ...
      }
    }
  },
  {
    '/path/number/2' : {
      count : n,
      level : n,
      attributes: {
        attr1: ['a','list','of','distinct','values','for','attr1'],
        attr2,
        ...
      }
    }
  }
]
```

#### Info
There is a limit of maximum 10 values for each attributes.
