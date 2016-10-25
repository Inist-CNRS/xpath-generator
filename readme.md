Readme temporaire.

To test -> `node index.js`
Only API , cli not implemented.

edit index.js to change options .

ex:

`new FromFolder('output','format').generate()`
To test from sample folder 

`new FromXml('output','format').generate()`
To test from 1 xml file 

output option can be : 

- console
- a path, ex './' without xml name 

format option can be : 

- xpaths
- tree
- both, only work with path output

