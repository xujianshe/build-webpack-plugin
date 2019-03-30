//const ConcatSource = require('webpack-sources/lib/ConcatSource');
const pkghelper = require('../pkghelper');
//const path = require('path');

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
        compiler.plugin("compilation", compilation => {
            compilation.plugin("optimize-chunks", chunks => {
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
                                            if (global[resource] != element["_source"]._value) {
                                                for (let j = 0; j < loadRets.length; j++) {
                                                    let allParameterStr = pkghelper.getAllParameterStr(loadRets[j], this.seismicLoadPkgFuncName);
                                                    let overloadParameter = pkghelper.getOverloadMethodParameterStr(allParameterStr);

                                                    let obj = pkghelper.getDependenciesObj(loadRets[j], this.seismicLoadPkgFuncName);
                                                    if (obj) {
                                                        let fullVersion = pkghelper.getPkgNameAfterFilter(obj, overloadParameter);

                                                        let newLoadPkg = this.seismicLoadPkgFuncName + fullVersion;
                                                        sourceValue = sourceValue.replace(loadRets[j], newLoadPkg);

                                                        this.fillGlobalSeismicModules(chunk.name, obj);
                                                    }
                                                    //compilation.assets[key] = new ConcatSource(source);
                                                }
                                                element["_source"]._value = sourceValue;
                                                global[resource] = element["_source"]._value;
                                            }
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

    fillGlobalSeismicModules(key, obj) {
        let tempArray = [];
        if (typeof obj == "string") {
            tempArray.push(obj);
        } else {
            for (let i = 0; i < obj.length; i++) {
                tempArray.push(obj[i]);
            }
        }
        if (!global[key]) {
            global[key] = tempArray;
        } else {
            let allModules = global[key].concat(tempArray);
            global[key] = pkghelper.delRepeat(allModules);
        }
    }
}

module.exports = SeismicScriptReplacePlugin;