const ExternalModule = require('webpack/lib/ExternalModule');
const pkghelper = require('./pkghelper');
const NotFoundDependenciesNodeError = require('./errors/NotFoundDependenciesNodeError');
const NotFoundKeyInDependenciesNodeError = require('./errors/NotFoundKeyInDependenciesNodeError');
//const ConstDependency = require("webpack/lib/dependencies/ConstDependency")

/**
 * generate external modules
 */
class SeismicExternalModulePlugin {
    constructor(options) {
        this.commonPackageArray = new Array();
        this.seismicPackageArray = new Array();

        if (options.compkgs) {
            this.commonPackageArray = options.compkgs;
        }
        if (options.seismicpkgs) {
            this.seismicPackageArray = options.seismicpkgs;
        }

        this.pluginName = "seismic-external-module-plugin";
        this.localPkgObj = pkghelper.getLocalPackageJson();
    }

    apply(compiler) {
        this.execute(compiler);
    }

    execute(compiler) {
        compiler.hooks.normalModuleFactory.tap(this.pluginName, nmf => {
            nmf.hooks.factory.tap(this.pluginName, factory => async (data, cb) => {
                const fullModulePath = data.dependencies[0].request;
                let modulePath = "", subModulePath = "";
                if (fullModulePath.indexOf("/")) {
                    modulePath = fullModulePath.split('/')[0];
                    subModulePath = fullModulePath.replace(modulePath, "");
                } else {
                    modulePath = fullModulePath;
                }

                if (!this.seismicPackageArray.includes(modulePath) && !this.commonPackageArray.includes(modulePath)) {
                    factory(data, cb);
                } else {
                    if (!this.localPkgObj.dependencies) {
                        throw new NotFoundDependenciesNodeError();
                    }
                    if (!this.localPkgObj.dependencies[modulePath]) {
                        throw new NotFoundKeyInDependenciesNodeError(modulePath);
                    }

                    let fullVersion = modulePath + "@" + this.localPkgObj.dependencies[modulePath];
                    if (subModulePath) {
                        fullVersion = fullVersion + subModulePath;
                    }
                    let resisterContent = "window.__global_module_registers__['" + fullVersion + "']";
                    if (modulePath == 'react') {
                        resisterContent = "React";
                    }
                    if (modulePath == "react-dom") {
                        resisterContent = "ReactDOM";
                    }
                    cb(null, new ExternalModule(resisterContent, 'var', modulePath));
                }
            });
        });
    }
}

module.exports = SeismicExternalModulePlugin;