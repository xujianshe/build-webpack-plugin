
# seismic-build-webpack-plugin
This plug-in is used for seismic custom packaging, it's main work contains four parts:  
1. provides the simver parameter for "\_\_seismicLoadPackage__" method  
2. generate a manifest.json file  
3. generate external modules for common libraries   
4. generate special external modules for seismic libraries  

## Compatibility with webpack
The plugin require webpack version =3, smaller or higher version will not be supported

## Install
```
$ npm install --save-dev seismic-build-webpack-plugin
```
## About parameters
The parameters required by the plugin are composed of two parts, one is build-in parameters, another is input parameters.
There are same format parameters for them, such as:
```js
{
    externals:{
        'react':'React'
    },
    seismicPackages:[
        'seismic-toolkit'
    ]
}
```
`externals` used to external references for common Libraries  
`seismicPackages` used to special external modules for seismic libraries  
## About build-in parameters
Current build-in plugin parameters(will be continuously updated):
```js
        {
            externals: {
                'react': "React",
                'react-dom': "ReactDOM",
                'styled-components': "StyledComponents"
            },
            seismicPackages: [
                "seismic-toolkit",
                "seismic-content-manager",
                "seismic-workspace",
                "seismic-user-central",
                "seismic-profilebuilder",
                "seismic-doccenter",
                "seismic-admin-settings",
                "seismic-externalcontentsyncwizard"
            ]
        }
```
## About input parameters
The formal parameter is same for build-in parameter and input parameter,  The two types of parameters will be merged. The priority of input parameters is higher than build-in parameters.

## Usage with no input parameter
`webpack.config.js`
```js
const SeismicBuildWebpackPlugin from 'seismic-build-webpack-plugin'
...
...
...
plugins:[
    new SeismicBuildWebpackPlugin()
]
```
## Result
1.generate a manifest.json file 
2.generate related externals in js files,such as:
```js
/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
```
3.compile `__seismicLoadPackage__`method, such as:
```js
__seismicLoadPackage__('seismic-toolkit@^3.14.0')
```

## Usage with the 'externals' input parameters
`webpack.config.js`
```js
const SeismicBuildWebpackPlugin from 'seismic-build-webpack-plugin'
...
...
...
plugins:[
    new SeismicBuildWebpackPlugin({
        externals: [
            'moment':'Moment',
            ] })
]
```
## Result
1.generate a manifest.json file  
2.generate external modules for common libraries, such as:
```js
/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/* 2 */
/***/ (function(module, exports) {

module.exports = Moment;

/***/ }),

```
3.compile `__seismicLoadPackage__`method, such as:
```js
__seismicLoadPackage__('seismic-toolkit@^3.14.0')
```

## Usage with the 'seismicPackages' input parameters
`webpack.config.js`
```
const SeismicBuildWebpackPlugin from 'seismic-build-webpack-plugin'
...
...
...
plugins:[
    new SeismicBuildWebpackPlugin({
        seismicPackages:[
            'seismic-search'
        ] })
]
```
## Result
1.generate a manifest.json file   
2.generate external modules for common libraries, such as:
```js
/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
```
3.compile `__seismicLoadPackage__`method, such as:
```js
__seismicLoadPackage__('seismic-search@^1.0.0')
```

## Usage with multiple input parameters
`webpack.config.js`
```
const SeismicBuildWebpackPlugin from 'seismic-build-webpack-plugin'
...
...
...
plugins:[
    new SeismicBuildWebpackPlugin({
        externals: [
            'moment':'Moment',
            ] }),
        seismicPackages:[
            'seismic-search'
        ]
]
```
## Result
1.generate a manifest.json file  
2.generate external modules for common libraries, such as:
```js
/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/* 2 */
/***/ (function(module, exports) {

module.exports = Moment;

/***/ }),

```
3.compile `__seismicLoadPackage__`method, such as:
```js
__seismicLoadPackage__('seismic-search@^3.14.0')
```

# Known issues
## npm link
You are not able to use `npm link` to develop this plugin, it has a fetal issue which we haven't identified.
## story book
There is still a issue releated storybook@3, we need to fix it.
## about webpack 4
`chunk.parents` is not supported in webpack 4, `chunkGropus` will be worked, we have not yet completed it.