import React from 'react'
//import PooledClass from 'react/lib/PooledClass'
import ReactDom from 'react-dom';
//import StyledComponents from 'styled-components';
import toolkittest from 'seismic-toolkit/lib/moduleExport';
import toolkit from 'seismic-toolkit';

ReactDom.render(
    <h1>hello worldr!</h1>
    , document.getElementById('root')
);

//console.log(StyledComponents);
console.log(toolkittest);
console.log(toolkit);
console.log("test");
//console.log(PooledClass);
window.__seismicLoadPackage__("seismic-toolkit").then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

window.__seismicLoadPackage__('seismic-toolkit').then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

window.__seismicLoadPackage__("seismic-toolkit/lib/globalStyle").then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

window.__seismicLoadPackage__(["seismic-toolkit", "seismic-toolkit/lib/globalStyle"]).then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

window.__seismicLoadPackage__(["seismic-toolkit", "seismic-toolkit/lib/globalStyle"], toolkit).then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

window.__seismicLoadPackage__("seismic-toolkit", toolkit).then(toolkitComp => {
    this.setState({
        toolkitComp,
        loadingToolkit: false
    });
});

// window.__seismicLoadPackage__(
//     "seismic-toolkit",
//      toolkit
//      ).then(toolkitComp => {
//     this.setState({
//         toolkitComp,
//         loadingToolkit: false
//     });
// });