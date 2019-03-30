## Scene 1
##### replace script
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
in webpack.config.js
```js
plugins: [
        new SeismicBuildWebpackPlugin()
    ]
```

### Expectation
in output file, `window.__seismicLoadPackage__("seismic-toolkit")`  will be replaced with `window.__seismicLoadPackage__("seismic-toolkit@[semver]")`