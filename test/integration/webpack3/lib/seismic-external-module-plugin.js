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
        this.externals = {};
        this.commonPackageArray = new Array();
        this.seismicPackageArray = new Array();
        if (options.externals) {
            this.externals = options.externals;
        }

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
        compiler.plugin("normal-module-factory", nmf => {
            nmf.plugin("factory", factory => async (data, cb) => {
                const fullModulePath = data.dependencies[0].request;
                console.log(fullModulePath);
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

                    let resisterContent = "";
                    if (this.seismicPackageArray.includes(modulePath)) {
                        let fullVersion = modulePath + "@" + this.localPkgObj.dependencies[modulePath];
                        if (subModulePath) {
                            fullVersion = fullVersion + subModulePath;
                        }
                        resisterContent = "window.__global_module_registers__['" + fullVersion + "']";
                    } else {
                        resisterContent = this.externals[modulePath];
                    }
                    if (!resisterContent) {
                        factory(data, cb);
                    }
                    cb(null, new ExternalModule(resisterContent, 'var', modulePath));
                }
            });
        });
    }
}

module.exports = SeismicExternalModulePlugin;