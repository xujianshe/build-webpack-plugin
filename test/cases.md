# Here are all the cases which need to check for each release

# Cases

## Generate manifest with signle unnamed entry
### Given
##### in webpack.config.js
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
1. It should generate a file named `[packageName].manifest.[version].json`
2. The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"]
  }
}
```
## Generate manifest with signle entry named main
### Given
##### in webpack.config.js
```js
entry:{
    main: path.join(__dirname, '../src/entry.jsx'),
}
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
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
## Generate manifest with signle entry named others
### Given
##### in webpack.config.js
```js
entry:{
    sample: path.join(__dirname, '../src/entry.jsx'),
}
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
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

## Generate manifest with multiple entry
### Given
##### in webpack.config.js
```js
 entry: {
        'newdoccenter.entry': './src/cdn/newdoccenter.entry.js',
        'sfdc.predictive.entry': './src/cdn/sfdc.predictive.entry.js',
    },
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
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
}
...
plugins: [new SeismicPackagePlugin()]
```
and 
```js
 entry: {
     'seismic-article': './src/adaptor/article/entry.js',
       'seismic-news-center': './src/adaptor/news-center/entry.js'
    },
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
...
plugins: [new SeismicPackagePlugin()]
```
###Expectation
1. It should generate a file named `[packageName].manifest.[version].json`
2. The content of that file should be
```json
{
  "[packageName]@[version]/newdoccenter.entry": {
    "js": ["[packageName].[name].[chunkhash].js"],
  },
  "[packageName]@[version]/sfdc.predictive.entry": {
    "js": ["[packageName].[name].[chunkhash].js"],
  },
  "[packageName]@[version]/seismic-article": {
    "js": ["[packageName].[name].[chunkhash].js"],
  },
   "[packageName]@[version]/seismic-news-center": {
    "js": ["[packageName].[name].[chunkhash].js"],
  }
}
```

## Generate manifest with sub entry
### Given
##### in webpack.config.js
```js
entry:{
    'test/sample': path.join(__dirname, '../src/entry.jsx')
}
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
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

## Generate external modules
### Given
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
2. in the entry file, the plugin will appended a seismic-toolkit external module, the content is as follow:  
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
                "react": "^15.6.1",
                "react-dom": "^15.6.1",
                "seismic-toolkit@^3.14.0"
            ]
        },
    ```

## Generate external modules with importing seismic packages sub library
### Given
##### in source code
```js
import React form 'react';
import ReactDOM from 'react-dom';
import SeismicToolkit from 'seismic-toolkit/lib/moduleExport';
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
2. in the entry file, the plugin will appended a seismic-toolkit external module, the content is as follow:  
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
                "react-dom@^15.6.1",
                "react@^15.6.1",
                "seismic-toolkit@^3.14.0/lib/moduleExport"
            ],
        }
    ```

## Generate external modules with importing uppercase library name
### Given
##### in source code
```js
import React form 'React';
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
2. in the entry file, the plugin will appended a seismic-toolkit external module, the content is as follow:  
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
                "react-dom@^15.6.1",
                "react@^15.6.1",
                "seismic-toolkit@^3.14.0"
            ],
            "dependencies":[
                 "seismic-toolkit@^3.14.0"
            ]
        },
    ```
## Generate external modules with multiple entry
### Given
##### in source code
```js
import React form 'React';
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
entry: {
        'newdoccenter.entry': './src/cdn/newdoccenter.entry.js',
        'sfdc.predictive.entry': './src/cdn/sfdc.predictive.entry.js',
    },
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```  
and
```
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
2. in the entry file, the plugin will appended a seismic-toolkit external module, the content is as follow:  
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
    "[packageName]@[version]/newdoccenter.entry": {
            "js": [
                "${packageName}.[name].[chunkhash].js"
            ],
            "requires": [
                "react-dom@^15.6.1",
                "react@^15.6.1",
                "seismic-toolkit@^3.14.0"
            ],
            "dependencies":[
                 "seismic-toolkit@^3.14.0"
            ]
        },
        "[packageName]@[version]/sfdc.predictive.entry": {
            "js": [
                "${packageName}.[name].[chunkhash].js"
            ],
            "requires": [
                "react-dom@^15.6.1",
                "react@^15.6.1",
                "seismic-toolkit@^3.14.0"
            ],
            "dependencies":[
                 "seismic-toolkit@^3.14.0"
            ]
        }
    ```


## Async load support
### Given
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

## Async load support with sub library
### Given
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
## Async load support with an array
### Given
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
    externals:{
        'react':'React',
        'react-dom':'ReactDOM'
    },
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
## TODO: add more
