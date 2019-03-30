## Scene 1
### Generate manifest
#### Given
 in webpack.config.js
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
    "js": ["[packageName].[name].[chunkhash].js"],
    "cass":["${cssPath}.css"]
  }
}
```

## Scene 2
##### Generate manifest with common library
### Given
 in webpack.config.js
```js
entry: path.join(__dirname, '../src/entry.jsx'),
output: {
    filename: `${packageName}.[name].[chunkhash].js`,
}
```
and
```
plugins: [new SeismicPackagePlugin({compkgs:['react','react-dom'])]
```
### Exceptation
1.generate `react` and `react-dom` files(see cases-extract-common-chunks.md) 
2.generate a file named `[packageName].manifest.[version].json`  
3.The content of that file should be
```json
{
  "[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
    "requires": [
            "react-dom@[semver]",
            "react@[semver]]"
        ],
     "cass":["${cssPath}.css"]
  },
  "react-dom@[version]": {
        "js": [
            "seismic.shared.react-dom.[chunkhash]].js"
        ],
        "requires": [
            "react@[semver]]"
        ]
    },
    "react@[version]": {
        "js": [
            "seismic.shared.react.[chunkhash].js"
        ]
    }
}
```
## Scene 3
#####  Generate manifest with async
### Given
in source code
```js
window.__seismicLoadPackage__("seismic-toolkit").then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});
```
in package.json
```json
"seismicDependencies": {
        "seismic-toolkit": "^3.14.0"
    }
```
### Exceptation
1.generate `[packageName].manifest.[version].json`
2.the file contents are as follows:  
```json
"[packageName]@[version]": {
    "js": ["[packageName].[name].[chunkhash].js"],
     "cass":["${cssPath}.css"],
     "dependencies":[
       "seismic-toolki@[semver]"
     ]
  }
```