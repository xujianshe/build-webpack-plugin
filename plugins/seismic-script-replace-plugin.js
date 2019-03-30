const ConcatSource = require('webpack-sources/lib/ConcatSource');
const pkghelper = require('./pkghelper');
const path = require('path');

/**
 * replace the script of async loading package
 */
class SeismicScriptReplacePlugin {
    constructor(options) {
        if (!options) {
            throw Error("the plugin requires a parameter");
        }
        if (!options.regkey) {
            throw Error("the parameter requires a 'regkey' object");
        }
        this.seismicLoadPkgFuncName = options.regkey;
        this.pluginName = "seismic-script-replace-plugin";
    }

    apply(compiler) {
        this.execute(compiler);
    }

    execute(compiler) {
        compiler.hooks.thisCompilation.tap(this.pluginName, compilation => {
            compilation.hooks.optimizeChunksAdvanced.tap(this.pluginName, chunks => {
                let pattern = new RegExp(this.seismicLoadPkgFuncName + "[\\s]*?\\([\\s\\S]*?\\)", "g");
                for (let i = 0; i < chunks.length; i++) {
                    let chunk = chunks[i];
                    chunk.modulesIterable.forEach(element => {
                        let resource = element["resource"];
                        if (resource) {
                            if (resource.indexOf("node_modules") == -1) {
                                let source = element["_source"];
                                if (source) {
                                    let sourceValue = source._value;
                                    if (sourceValue) {
                                        let loadRets = sourceValue.match(pattern);
                                        if (loadRets && loadRets.length > 0) {
                                            for (let i = 0; i < loadRets.length; i++) {
                                                let fullVersion = pkghelper.getPkgNameAfterFilter(loadRets[i], this.seismicLoadPkgFuncName);
                                                let newLoadPkg = this.seismicLoadPkgFuncName + fullVersion;
                                                sourceValue = sourceValue.replace(loadRets[i], newLoadPkg);
                                                //compilation.assets[key] = new ConcatSource(source);
                                            }
                                            element["_source"]._value = sourceValue;
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            })
        })
    }
}

module.exports = SeismicScriptReplacePlugin;