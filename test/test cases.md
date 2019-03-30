# Here are all the test cases which need to check for each release

# Cases
## no parameter cases
```
plugins: [new SeismicPackagePlugin()]
```

### Given with kinds of source code
### 1
#### in source js
```js
console.log('test');
```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"]
  }
}
```

### 2
#### in source js
```js
import React from 'react';
import ReactDom from 'react-dom'

console.log(React);
console.log(ReactDom);
```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1"
    ]
  }
}
```

### 3
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'

console.log(React);
console.log(ReactDom);


```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1"
    ]
  }
}
```

### 4
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'
import toolkit from 'seismic-toolkit';

console.log(React);
console.log(ReactDom);

```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];

/***/ }),
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1",
      "seismic-toolkit@^3.14.0",
    ]
  }
}
```

### 5
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'
import toolkit from 'seismic-toolkit';
import toolkittest from 'seismic-toolkit/lib/moduleExport';

console.log(React);
console.log(ReactDom);

```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0/lib/moduleExport'];

/***/ }),
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1",
      "seismic-toolkit@^3.14.0",
      "seismic-toolkit@^3.14.0/lib/moduleExport"
    ]
  }
}
```

### 6
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'
import toolkit from 'seismic-toolkit';
import toolkittest from 'seismic-toolkit/lib/moduleExport';

console.log(React);
console.log(ReactDom);

window.__seismicLoadPackage__("seismic-toolkit").then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0/lib/moduleExport'];

/***/ }),
```
- It should compile `__seismicLoadPackage__`, such as:
```js
__seismicLoadPackage__('seismic-toolkit@^3.14.0')
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1",
      "seismic-toolkit@^3.14.0",
      "seismic-toolkit@^3.14.0/lib/moduleExport"
    ],
    "dependencies": [
      "seismic-toolkit@^3.14.0"
    ]
  }
}
```

### 7
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'
import toolkit from 'seismic-toolkit';
import toolkittest from 'seismic-toolkit/lib/moduleExport';

console.log(React);
console.log(ReactDom);

window.__seismicLoadPackage__('seismic-toolkit').then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0/lib/moduleExport'];

/***/ }),
```
- It should compile `__seismicLoadPackage__`, such as:
```js
__seismicLoadPackage__('seismic-toolkit@^3.14.0')
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1",
      "seismic-toolkit@^3.14.0",
      "seismic-toolkit@^3.14.0/lib/moduleExport"
    ],
    "dependencies": [
      "seismic-toolkit@^3.14.0"
    ]
  }
}
```

### 8
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'
import toolkit from 'seismic-toolkit';
import toolkittest from 'seismic-toolkit/lib/moduleExport';

console.log(React);
console.log(ReactDom);

window.__seismicLoadPackage__("seismic-toolkit/lib/globalStyle").then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0/lib/moduleExport'];

/***/ }),
```
- It should compile `__seismicLoadPackage__`, such as:
```js
__seismicLoadPackage__('seismic-toolkit@^3.14.0/lib/globalStyle')
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1",
      "seismic-toolkit@^3.14.0",
      "seismic-toolkit@^3.14.0/lib/moduleExport"
    ],
    "dependencies": [
      "seismic-toolkit@^3.14.0/lib/moduleExport"
    ]
  }
}
```

### 9
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'
import toolkit from 'seismic-toolkit';
import toolkittest from 'seismic-toolkit/lib/moduleExport';

console.log(React);
console.log(ReactDom);

window.__seismicLoadPackage__(["seismic-toolkit", "seismic-toolkit/lib/globalStyle"]).then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0/lib/moduleExport'];

/***/ }),
```
- It should compile `__seismicLoadPackage__`, such as:
```js
__seismicLoadPackage__(['seismic-toolkit@^3.14.0','seismic-toolkit@^3.14.0/lib/globalStyle'])
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1",
      "seismic-toolkit@^3.14.0",
      "seismic-toolkit@^3.14.0/lib/moduleExport"
    ],
    "dependencies": [
      "seismic-toolkit@^3.14.0"
    ]
  }
}
```

### 10
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'
import toolkit from 'seismic-toolkit';
import toolkittest from 'seismic-toolkit/lib/moduleExport';

console.log(React);
console.log(ReactDom);

window.__seismicLoadPackage__("seismic-toolkit", toolkit).then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0/lib/moduleExport'];

/***/ }),
```
- It should compile `__seismicLoadPackage__`, such as:
```js
__seismicLoadPackage__('seismic-toolkit@^3.14.0', _seismicToolkit2.default)
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1",
      "seismic-toolkit@^3.14.0",
      "seismic-toolkit@^3.14.0/lib/moduleExport"
    ],
    "dependencies": [
      "seismic-toolkit@^3.14.0"
    ]
  }
}
```

### 11
#### in source js
```js
import React from 'React';
import ReactDom from 'react-dom'
import toolkit from 'seismic-toolkit';
import toolkittest from 'seismic-toolkit/lib/moduleExport';

console.log(React);
console.log(ReactDom);

window.__seismicLoadPackage__(["seismic-toolkit", "seismic-toolkit/lib/globalStyle"], toolkit).then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0/lib/moduleExport'];

/***/ }),
```
- It should compile `__seismicLoadPackage__`, such as:
```js
__seismicLoadPackage__(['seismic-toolkit@^3.14.0','seismic-toolkit@^3.14.0/lib/globalStyle'], _seismicToolkit2.default)
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
      "react-dom@^15.6.1",
      "react@^15.6.1",
      "seismic-toolkit@^3.14.0",
      "seismic-toolkit@^3.14.0/lib/moduleExport"
    ],
    "dependencies": [
      "seismic-toolkit@^3.14.0"
    ]
  }
}
```

### Given with Checking webpack config 
#### in source js
```js
import React from 'react';
import ReactDom from 'react-dom'

console.log(React);
console.log(ReactDom);
```
#### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
- there is a seismic warning about 'library' ,like as below:
(seismic-build-webpack-plugin) Warning: The 'library' node is empty in the 'output' config, it is recommmended to
configure the name of your repo.
- there are two externals generated, such as:
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
```
- It should generate a file named `[packageName].manifest.[version].json`
- The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
                "react@^15.6.1",
                "react-dom@^15.6.1"
            ]
  }
}
```

### Given with signle unnamed entry
##### in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
    library:'repoName'
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
1. It should generate a file named `[packageName].manifest.[version].json`
2. The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"]
  }
}
```

### Given with signle entry named 
##### in webpack.config.js
```js
entry:{
    main: path.join(__dirname, '../src/entry.jsx'),
}
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
    library:'repoName'
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
1. It should generate a file named `[packageName].manifest.[version].json`
2. The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"]
  }
}
```

### Given with signle entry named others
##### in webpack.config.js
```js
entry:{
    sample: path.join(__dirname, '../src/entry.jsx'),
}
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
    library:'repoName'
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
1. It should generate a file named `[packageName].manifest.[version].json`
2. The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"]
  },
  "[packageName]@[version]/sample": {
    "js": ["[packageName].[name].[chunkhash].js"]
  }
}
```

### Given with multiple entry
##### in webpack.config.js
```js
 entry: {
        'newdoccenter.entry': './src/cdn/newdoccenter.entry.js',
        'sfdc.predictive.entry': './src/cdn/sfdc.predictive.entry.js',
    },
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
    library:'repoName'
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
### Expectation
1. It should generate a file named `[packageName].manifest.[version].json`
2. The content of that file should be
```json
{
  "[packageName]@[version]/newdoccenter.entry": {
    "js": ["[packageName].[name].[chunkhash].js"],
  },
  "[packageName]@[version]/sfdc.predictive.entry": {
    "js": ["[packageName].[name].[chunkhash].js"],
  }
}
```

### Given with sub entry
##### in webpack.config.js
```js
entry:{
    'test/sample': path.join(__dirname, '../src/entry.jsx')
}
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
    library:'repoName'
}
```
and
```
plugins: [new SeismicPackagePlugin()]
```
#### Expectation
1. It should generate a file named `[packageName].manifest.[version].json`
2. The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].test-sample.[chunkhash].js"]
  },
  "[packageName]@[version]/test/sample": {
    "js": ["[packageName].test-sample.[chunkhash].js"]
  }
}
```

## the 'external' parameter cases
```js
plugins: [new SeismicPackagePlugin({
    externals:{
        'moment':'Moment'
    }
})]
```
### Given 
##### in source code
```js
import React form 'moment';
```
in package.json
```json
 "dependencies": {
        "moment": "^1.0.0",
        ...
 }
```
##### in webpack.config.js
```js
plugins: [new SeismicPackagePlugin({
    externals:{
        'moment':'Moment'
    }
})]
```
### Expectation
1. generate a entry file named `${packageName}.[name].[chunkhash].js`  
2. in the entry file, the plugin will appended  external modules, the contents are as follow:  
    ```js
    /* 0 */
    /***/ (function(module, exports) {

    module.exports = Moment;

    /***/ }),
    
    ``` 
3. generate `[packageName].manifest.[version].json`, the content is as follow:  
    ```json
    "[packageName]@[version]": {
            "js": [
                "${packageName}.[name].[chunkhash].js"
            ],
            "requires": [
                "moment@^1.0.0"
            ]
        },
    ```

## the 'seismicPackages' parameter cases
```js
plugins: [new SeismicPackagePlugin({
    seismicPackages[
        "seismic-search"
    ]
})]
```
### Given
##### in source code
```js
import SeismicToolkit from 'seismic-search';
```
##### in package.json
```json
 "dependencies": {
        "seismic-search": "^1.0.0",
        ...
 }
```
##### in webpack.config.js
```js
plugins: [new SeismicPackagePlugin({
    seismicPackages:['seismic-search']
})]
```
### Expectation
1. generate a entry file named `${packageName}.[name].[chunkhash].js`  
2. in the entry file, the plugin will appended a seismic-toolkit external module, the content is as follow:  
    ```js
    /* 2 */
    /***/ (function(module, exports) {

    module.exports = window.__global_module_registers__['seismic-search@^1.0.0'];
    /***/ })
    
    ``` 
3. generate `[packageName].manifest.[version].json`, the content is as follow:  
    ```json
    "[packageName]@[version]": {
            "js": [
                "${packageName}.[name].[chunkhash].js"
            ],
            "requires": [
                "seismic-search@^1.0.0"
            ]
        },
    ```

### Given with importing seismic packages sub library
##### in source code
```js
import SeismicToolkit from 'seismic-toolkit/lib/moduleExport';
```
##### in package.json
```json
 "dependencies": {
        "seismic-toolkit": "^3.14.0",
        ...
 }
```
##### in webpack.config.js
```js
plugins: [new SeismicPackagePlugin({
    seismicPackages:['seismic-toolkit']
})]
```
### Expectation
1. generate a entry file named `${packageName}.[name].[chunkhash].js`  
2. in the entry file, the plugin will appended a seismic-toolkit external module, the content is as follow:  
    ```js
    /* 2 */
    /***/ (function(module, exports) {

    module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0/lib/moduleExport'];
    /***/ })
    
    ``` 
3. generate `[packageName].manifest.[version].json`, the content is as follow:  
    ```json
    "[packageName]@[version]": {
            "js": [
                "${packageName}.[name].[chunkhash].js"
            ],
            "requires": [
                "seismic-toolkit@^3.14.0/lib/moduleExport"
            ],
        }
    ```

### Given with multiple entry
##### in source code
```js
import SeismicToolkit from 'seismic-toolkit';
```
##### in package.json
```json
 "dependencies": {
        "seismic-toolkit": "^3.14.0",
        ...
 }
```
##### in webpack.config.js
```js
entry: {
        'newdoccenter.entry': './src/cdn/newdoccenter.entry.js',
        'sfdc.predictive.entry': './src/cdn/sfdc.predictive.entry.js',
    },
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
    library:'repoName'
}
```  
and
```
plugins: [new SeismicPackagePlugin({
    seismicPackages:['seismic-toolkit']
})]
```
### Expectation
1. generate a entry file named `${packageName}.[name].[chunkhash].js`  
2. in the entry file, the plugin will appended a seismic-toolkit external module, the content is as follow:  
    ```js
    /* 2 */
    /***/ (function(module, exports) {

    module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];
    /***/ })
    ``` 
3. generate `[packageName].manifest.[version].json`, the content is as follow:  
    ```json
    "[packageName]@[version]/newdoccenter.entry": {
            "js": [
                "${packageName}.[name].[chunkhash].js"
            ],
            "requires": [
                "seismic-toolkit@^3.14.0"
            ]
        },
        "[packageName]@[version]/sfdc.predictive.entry": {
            "js": [
                "${packageName}.[name].[chunkhash].js"
            ],
            "requires": [
                "seismic-toolkit@^3.14.0"
            ]
        }
    ```

### Given with async loading support
#### in source code
```js
window.__seismicLoadPackage__("seismic-toolkit").then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});
```
#### in package.json
```json
"dependencies": {
        "seismic-toolkit": "^3.14.0"
    }
```
### in webpack.config.js
```js
plugins: [new SeismicPackagePlugin()]
```

### Expectation
1.`window.__seismicLoadPackage__("seismic-toolkit")` should be replaced with `window.__seismicLoadPackage__("seismic-toolkit@semver")`, like as below:
```js
window.__seismicLoadPackage__("seismic-toolkit@^3.14.0").then...
});
```  
2.there is a dependencies node in manifest,like as below:
```
"dependencies":["seismic-toolkit@^3.14.0"]
```

### Given async loading support with sub library
#### in source code
```js
window.__seismicLoadPackage__("seismic-toolkit/lib/formatIcon").then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});
```
#### in package.json
```json
"dependencies": {
        "seismic-toolkit": "^3.14.0"
    }
```
### in webpack.config.js
```js
plugins: [new SeismicPackagePlugin({
    externals:{
        'react':'React',
        'react-dom':'ReactDOM'
    },
    seismicPackages:['seismic-toolkit','seismic-content-manage']
})]
```
### Expectation
1.`window.__seismicLoadPackage__("seismic-toolkit/lib/formatIcon")` should be replaced with `window.__seismicLoadPackage__("seismic-toolkit@semver/lib/formatIcon")`, like as below:
```js
window.__seismicLoadPackage__("seismic-toolkit@^3.14.0/lib/formatIcon").then...
});
```  
2.there is a dependencies node in manifest,like as below:
```json
"dependencies":["seismic-toolkit@^3.14.0/lib/formatIcon"]
```

### Given async loading support with the array type
#### in source code
```js
window.__seismicLoadPackage__(["seismic-toolkit/lib/formatIcon","seismic-content-manager"]).then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});
```
#### in package.json
```json
"dependencies": {
        "seismic-toolkit": "^3.14.0",
        "seismic-content-manager": "^1.0.0"
    }
```
### in webpack.config.js
```js
plugins: [new SeismicPackagePlugin({
    seismicPackages:['seismic-toolkit','seismic-content-manage']
})]
```

### Expectation
1.`window.__seismicLoadPackage__(["seismic-toolkit/lib/formatIcon","seismic-content-manager"])` should be replaced with `window.__seismicLoadPackage__(["seismic-toolkit@semver/lib/formatIcon","seismic-content-manager@semver"])`, like as below:
```js
window.__seismicLoadPackage__(["seismic-toolkit@^3.14.0/lib/formatIcon","seismic-content-manager@^1.0.0"]).then...
});
```
2.there is a dependencies node in manifest,like as below:
```json
"dependencies":[
    "seismic-toolkit@^3.14.0/lib/formatIcon",
    "seismic-content-manager@^1.0.0"
]
```

## Combination parameters cases
```js
plugins: [new SeismicPackagePlugin({
    externals:{
        'react':'React',
        'react-dom':'ReactDOM'
    },
    seismicPackages:['seismic-toolkit']
})]
```

### Given with the single option
##### in source code
```js
import React form 'react';
import ReactDOM from 'react-dom';
import SeismicToolkit from 'seismic-toolkit';
```
##### in package.json
```json
 "dependencies": {
        "react": "^15.6.1",
        "react-dom": "^15.6.1",
        "seismic-toolkit": "^3.14.0",
        ...
 }
```
##### in webpack.config.js
```js
plugins: [new SeismicPackagePlugin({
    externals:{
        'react':'React',
        'react-dom':'ReactDOM'
    },
    seismicPackages:['seismic-toolkit']
})]
```
### Expectation
1. generate a entry file named `${packageName}.[name].[chunkhash].js`  
2. in the entry file, the plugin will appended external modules, the content is as follow:  
    ```js
    /* 0 */
    /***/ (function(module, exports) {

    module.exports = React;

    /***/ }),
    /* 1 */
    /***/ (function(module, exports) {

    module.exports = ReactDOM;

    /***/ }),
    /* 2 */
    /***/ (function(module, exports) {

    module.exports = window.__global_module_registers__['seismic-toolkit@^3.14.0'];
    /***/ })
    
    ``` 
3. generate `[packageName].manifest.[version].json`, the content is as follow:  
    ```json
    "[packageName]@[version]": {
            "js": [
                "${packageName}.[name].[chunkhash].js"
            ],
            "requires": [
                "react@^15.6.1",
                "react-dom@^15.6.1",
                "seismic-toolkit@^3.14.0"
            ]
        },
    ```

## Generate manifest with multiple options
### Given
##### in webpack.config.js
```js
 entry: {
        'newdoccenter.entry': './src/cdn/newdoccenter.entry.js',
        'sfdc.predictive.entry': './src/cdn/sfdc.predictive.entry.js',
    },
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
    library:'repoName'
}
...
plugins: [new SeismicPackagePlugin(

)]
```
and 
```js
 entry: {
     'seismic-article': './src/adaptor/article/entry.js',
       'seismic-news-center': './src/adaptor/news-center/entry.js'
    },
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
    library:'repoName'
}
```js
plugins: [new SeismicPackagePlugin({
    externals:{
        'react':'React',
        'react-dom':'ReactDOM'
    },
    seismicPackages:['seismic-toolkit']
})]
```
###Expectation
1. It should generate a file named `[packageName].manifest.[version].json`
2. The content of that file should be
```json
{
  "[packageName]@[version]/newdoccenter.entry": {
    "js": ["[packageName].[name].[chunkhash].js"],
    
            "requires": [
                "react@^15.6.1",
                "react-dom@^15.6.1",
                "seismic-toolkit@^3.14.0"
            ]
  },
  "[packageName]@[version]/sfdc.predictive.entry": {
    "js": ["[packageName].[name].[chunkhash].js"],
            "requires": [
                "react@^15.6.1",
                "react-dom@^15.6.1",
                "seismic-toolkit@^3.14.0"
            ]
  },
  "[packageName]@[version]/seismic-article": {
    "js": ["[packageName].[name].[chunkhash].js"],
            "requires": [
                "react@^15.6.1",
                "react-dom@^15.6.1",
                "seismic-toolkit@^3.14.0"
            ]
  },
   "[packageName]@[version]/seismic-news-center": {
    "js": ["[packageName].[name].[chunkhash].js"],
            "requires": [
                "react@^15.6.1",
                "react-dom@^15.6.1",
                "seismic-toolkit@^3.14.0"
            ]
  }
}
```