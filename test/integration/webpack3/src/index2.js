import React from 'react'
import ReactDom from 'react-dom';


ReactDom.render(
    <h1>hello worldr!</h1>
    , document.getElementById('root')
);

window.__seismicLoadPackage__("seismic-toolkit").then(toolkitComp => {
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