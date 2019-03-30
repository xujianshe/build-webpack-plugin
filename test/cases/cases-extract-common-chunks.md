## Scene 1
##### extract the single common library
### Given
in source code  
```js
import React from 'react'
```
in package.json
```json
"dependencies": {
    "react": "^15.6.1"
  }
```
in webpack.config.js
```js
plugins: [
        new SeismicBuildWebpackPlugin({ compkg: ['react'] })
    ]
```
### Expectation
1.generate a new file : `seismic.shared.react.[contenthash].js`    
2.generate a react external moudle (see cases-generate-external-modules.md) and removed all modules about `react` in entry chunk file  
3.in the manifest file:
- There should be a root node about react
    ```json
    "react@[version]": { "js": ["seismic.shared.react.[contenthash].js"] }
    ```  
- There should be requires node like this in [packageName]@[version] node
    ```json
    "requires": ["react@[semver]"]
    ```

## Scene 2
##### extract multiple common libraries with dependencies
### Given
in source code  
```js
import React from 'react'
import StyledComponents from 'styled-components'
```
in package.json
```json
"dependencies": {
    "react": "^15.6.1",
    "styled-components": "3.2.6"
  }
```
in webpack.config.js
```js
plugins: [
        new SeismicBuildWebpackPlugin({ compkg: ['react','styled-components'] })
    ]
```
### Expectation
1.generate two new files : `seismic.shared.react.[contenthash].js` and `seismic.shared.styled-components.[contenthash].js`  
2.generate two external modules: `react` and `styled-components` (see cases-generate-external-modules.md) and removed all modules about `react` in entry chunk file  
3.generate a external module :`react` (see cases-generate-external-modules.md) in `seismic.shared.styled-components.[contenthash].js`  
4.in the manifest file:
- There should be a root node about react
    ```json
    "react@[version]": { "js": ["seismic.shared.react.[contenthash].js"] },
    "styled-components@[version]": { "js": ["seismic.shared.styled-components.[contenthash].js"] }
    ```  
- There should be requires node like this in [packageName]@[version] node
    ```json
    "requires": ["react@[semver]","styled-components@[semver]"]
    ```
## Scene 3
##### extract multiple common libraries with blank
###Given
in source code  
```js
import React from 'react'
import StyledComponents from 'styled-components'
import SeismicToolkit from 'seismic-toolkit'
```
in package.json
```json
"dependencies": {
    "react": "^15.6.1",
    "styled-components": "3.2.6"
  }
```
in webpack.config.js
```js
plugins: [
        new SeismicBuildWebpackPlugin({ compkg: ['react','styled-components','seismic-toolkit'] })
    ]
```
### Expectation
1. see `Scene 2`
2. there should be a error message in node console or terminal, like as follow :  
```
ERROR in ./src/index.js
Module not found: Error: Can't resolve 'seismic-toolkit' 
```

## Scene 4
##### extract the common library with sub library
### Given
in source code  
```js
import React from 'react'
import PooledClass from 'react/lib/PooledClass' 
```
in package.json
```json
"dependencies": {
    "react": "^15.6.1"
  }
```
in webpack.config.js
```js
plugins: [
        new SeismicBuildWebpackPlugin({ compkg: ['react'] })
    ]
```
### Exceptation
1.generate a new file : `seismic.shared.react.[contenthash].js`    
2.generate a react external moudle (see cases-generate-external-modules.md) and removed all modules about `react` excepted `PooledClass` and its dependencies in entry chunk file, as follow :
```js
/***/ "./node_modules/react/lib/PooledClass.js":
/*!***********************************************!*\
  !*** ./node_modules/react/lib/PooledClass.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("...");

/***/ }),

/***/ "./node_modules/fbjs/lib/invariant.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/invariant.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("...");
/***/ }),
```
3.in the manifest file:
- There should be a root node about react
    ```json
    "react@[version]": { "js": ["seismic.shared.react.[contenthash].js"] }
    ```  
- There should be requires node like this in [packageName]@[version] node
    ```json
    "requires": ["react@[semver]"]
    ```
## Scene 5
##### extract the common libarary with polyfill
### Given
in source code  
```js
import React from 'react'
import ReactDom from 'react-dom'
```
in package.json
```json
"dependencies": {
    "react":"^15.6.1"
    "react-dom": "^15.6.1"
  }
```
in webpack.config.js
```js
plugins: [
        new SeismicBuildWebpackPlugin({ compkg: ['react','react-dom'] })
    ]
```
### Exceptation
1.see Scene 1   
2.there is added module named `browser.js` in `seismic.shared.react-dom.[contenthash].js`
like as follow:  
```js
/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("...");

/***/ }),
```
   
