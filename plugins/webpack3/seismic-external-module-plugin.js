const ExternalModule = require('webpack/lib/ExternalModule');
const pkghelper = require('../pkghelper');
const NotFoundDependenciesNodeError = require('../errors/NotFoundDependenciesNodeError');
const NotFoundKeyInDependenciesNodeError = require('../errors/NotFoundKeyInDependenciesNodeError');
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
                let modulePath = "", subModulePath = "";
                if (fullModulePath.indexOf("/") != -1) {
                    modulePath = fullModulePath.split('/')[0];
                    subModulePath = fullModulePath.replace(modulePath, "");
                } else {
                    modulePath = fullModulePath;
                }

                let userReuqest="";
                let lowModulePath = modulePath.toLocaleLowerCase();
                if (!this.seismicPackageArray.includes(lowModulePath) && !this.commonPackageArray.includes(lowModulePath)) {
                    factory(data, cb);
                } else {
                    if (!this.localPkgObj.dependencies) {
                        throw new NotFoundDependenciesNodeError();
                    }
                    if (!this.localPkgObj.dependencies[lowModulePath] && (this.localPkgObj.peerDependencies && !this.localPkgObj.peerDependencies[lowModulePath])) {
                        throw new NotFoundKeyInDependenciesNodeError(modulePath);
                    }

                    let resisterContent = "";
                    if (this.seismicPackageArray.includes(lowModulePath)) {
                        let fullVersion = lowModulePath + "@" + this.localPkgObj.dependencies[modulePath];
                        if (subModulePath) {
                            fullVersion = fullVersion + subModulePath;
                        }
                        resisterContent = "window.__global_module_registers__['" + fullVersion + "']";
                        userReuqest=fullModulePath;
                    } else {
                        resisterContent = this.externals[lowModulePath];
                        userReuqest=modulePath;
                    }
                    cb(null, new ExternalModule(resisterContent, 'var', userReuqest));
                }
            });
        });
    }
}

module.exports = SeismicExternalModulePlugin;