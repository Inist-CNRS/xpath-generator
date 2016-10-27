Xpath-Generator
=====

Node script (Api & ClI) that can generate a tree or xpaths, group & count them.

##CLI :

    npm i -g xpath-generator`

Then -> 

    xpath-generator -f /folder/ -o /output`

##Install :

    npm i -save xpath-generator`

Load it:

    const FromXML = require('xpath-generator').FromXML,
          FromFolder = require('xpath-generator').FromFolder;
        

Use it :

    let xml = new FromXml().generate(Path to XML).then(result=> {
         for (var key in result) {
           console.log(`${path} ${result[path].count}`);
         }
    });
    let xmls = new FromFolder().generateAll(program.folder).then(result=> {
        for (var key in result) {
          console.log(`${path} ${result[path].count}`);
        }
    });
    

result will return something like 

    [
        {
            '/path/number/1' : {
                count : n
                level : n
             }
        },
        {
            '/path/number/2' : {
              count : n
              level : n
            }
       }
    ]


### options

#### File : 

#### Folder :
output option can be : 

- console
- a path, ex './' without xml name 

Type option can be :

- xpaths
- tree
- both, only work with path output, not console

