## Scene 1  
##### Generate  external modules
### Given  
in source code  
```js
import seismicToolkit from 'seismic-toolkit';
```
in package.json  
```json  
"seismicDependencies": {
        "seismic-toolkit": "^3.14.0"
    }
```
and in webpack.config.js
```
plugins: [new SeismicPackagePlugin()]
``` 
## Expectation
1.in the output file, the following contents will be appended:  
```js
/***/ "seismic-toolkit":
/*!********************************************************************************!*\
  !*** external "window.__global_module_registers__['seismic-toolkit@^3.14.0']" ***!
  \********************************************************************************/
/***/ (function(module, exports) {

eval("module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];\n\n//# sourceURL=webpack:///external_%22window.__global_module_registers__%5B'seismic-toolkit@^3.14.0'%5D%22?");

/***/ })
```
among them, 'seismic-toolkit@^3.14.0' conform to the rule: 'seismic-toolkit@[semver]',  
'[semver]' is from 'seismicDependencies' node in package.json  
2.in the output file, there should be a reference to external module code，like this:  
```js
_seismicToolkit = __webpack_require__(/*! seismic-toolkit */ \"seismic-toolkit\")
```

3.generate the manifest file(see cases-generate-manifest.md)  
4.in the manifest file, the contents are as follows:  
```json
 "requires": [
            "seismic-toolkit@^3.14.0"
        ]
```
