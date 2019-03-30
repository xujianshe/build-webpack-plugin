const resolvePkg = require('resolve-pkg');
const path = require('path');
const NotFoundPackageJsonError = require('./errors/NotFoundPackageJsonError');
const NotFoundKeyInDependenciesNodeError = require('./errors/NotFoundKeyInDependenciesNodeError');

/**
 * package.json helper
 */
class pkghelper {
    static getNodeModulePackageJson(moduleName) {
        let pkgPath = resolvePkg(moduleName, { cwd: process.cwd() });
        let pkgJson = path.join(pkgPath, 'package.json');
        let pkgJsonObj = require(pkgJson);

        if (!pkgJsonObj) {
            throw new NotFoundPackageJsonError(pkgJson);
        }
        return pkgJsonObj;
    }
    static getLocalPackageJson() {
        let packagePath = path.join(process.cwd(), "package.json");
        let pkgJsonObj = require(packagePath);

        if (!pkgJsonObj) {
            throw new NotFoundPackageJsonError(packagePath);
        }
        return pkgJsonObj;
    }

    static getEntryFullVersionObj(pkgJsonObj, commonPackageArray, seismicPackageArray, webpackModuleArray, outPutFileNames) {
        var temp = {};
        temp.js = pkghelper.getEntryPackageJs(outPutFileNames);
        temp.requires = pkghelper.getEntryPointPackageRequires(pkgJsonObj, commonPackageArray, seismicPackageArray, webpackModuleArray);
        temp.dependencies = pkghelper.getDependencies(pkgJsonObj.seismicDependencies);

        if (temp.requires.length == 0 && temp.dependencies.length == 0) {
            return { js: temp.js };
        }
        if (temp.requires.length > 0 && temp.dependencies.length == 0) {
            return { js: temp.js, requires: temp.requires };
        }
        if (temp.requires.length == 0 && temp.dependencies.length > 0) {

            return { js: temp.js, dependencies: temp.dependencies };
        }

        return { js: temp.js, requires: temp.requires, dependencies: temp.dependencies };
    }

    static getFullVersionObj(pkgJsonObj, webpackModuleArray, hash) {
        var temp = {};
        temp.js = pkghelper.getPackageJs(pkgJsonObj, webpackModuleArray, hash);
        temp.requires = pkghelper.getPackageRequires(pkgJsonObj, webpackModuleArray);

        return temp.requires.length > 0 ? { js: temp.js, requires: temp.requires } : { js: temp.js };
    }

    //get fullVersion
    static getFullVersion(pkgJsonObj) {
        return pkgJsonObj.name + "@" + pkgJsonObj.version;
    }

    static getDependVersion(pkgJsonObj, dependLibName) {
        let ret = "";
        let depens = pkgJsonObj.dependencies;
        let peerDepens = pkgJsonObj.peerDependencies;

        if (depens) {
            for (const key in depens) {
                if (dependLibName == key) {
                    ret = key + "@" + depens[key];
                }
            }
        }
        if (peerDepens) {
            for (const key in peerDepens) {
                if (dependLibName == key) {
                    ret = key + "@" + peerDepens[key];
                }
            }
        }
        return ret;
    }

    static getSeismicDependsKeys(pkgJsonObj) {
        let ret = new Array();
        if (pkgJsonObj.seismicDependencies) {
            for (const key in pkgJsonObj.seismicDependencies) {
                ret.push(key);
            }
        }
        return pkghelper.delRepeat(ret).filter(d => d);
    }

    static getSeismicDepends(pkgJsonObj, pkgName) {
        let ret = "";
        if (pkgJsonObj.seismicDependencies) {
            ret = pkgName + '@' + pkgJsonObj.seismicDependencies[pkgName];
        }
        return ret;
    }

    static getEntryPackageJs(outPutFileNames) {
        let js = new Array();
        js.push(outPutFileNames);
        return js;
    }

    //get 'js'
    static getPackageJs(pkgJsonObj, commonPackageArray, hash) {
        let js = new Array();
        if (commonPackageArray.includes(pkgJsonObj.name)) {

            js.push("seismic.shared." + pkgJsonObj.name + "." + hash + ".js");
        }
        return js;
    }

    static getCommonChunkFileName(chunk) {
        let hash = chunk.hash.length > 20 ? chunk.hash.substring(0, 20) : chunk.hash;
        return "seismic.shared." + chunk.name + "." + hash + ".js"
    }

    //get entryPoint package requires
    static getEntryPointPackageRequires(pkgJsonObj, commonPackageArray, seismicPackageArray, webpackModuleArray) {
        var requires = new Array();
        // let seismicDepens = seismicPackageArray // pkgJsonObj.seismicDependencies;
        let depends = seismicPackageArray.concat(commonPackageArray);
        // if (seismicPackageArray) {
        //     for (let i = 0; i < seismicPackageArray.length; i++) {
        //         if (webpackModuleArray.includes(commonPackageArray[i])) {
        //             if (webpackModuleArray.includes(seismicPackageArray[i])) {
        //                 requires.push(key + "@" + pkghelper.getVersion(pkgJsonObj, seismicPackageArray[i]));
        //             }
        //         }
        //     }
        // }
        if (depends) {
            for (let i = 0; i < depends.length; i++) {
                if (webpackModuleArray.includes(depends[i])) {
                    let version = pkghelper.getVersion(pkgJsonObj, depends[i]);
                    if (!version) {
                        throw new NotFoundKeyInDependenciesNodeError(depends[i]);
                    }
                    requires.push(depends[i] + "@" + version);
                }
            }
        }
        let ret = pkghelper.delRepeat(requires).filter(d => d);
        return ret;
    }

    static getVersion(pkgJsonObj, pkgName) {
        let ret = "";
        if (pkgJsonObj.dependencies) {
            if (pkgJsonObj.dependencies[pkgName]) {
                ret = pkgJsonObj.dependencies[pkgName]
            }
        }
        if (pkgJsonObj.peerDependencies) {
            if (pkgJsonObj.peerDependencies[pkgName]) {
                ret = pkgJsonObj.peerDependencies[pkgName];
            }
        }
        return ret;
    }

    //get requaires
    static getPackageRequires(pkgJsonObj, webpackModuleArray) {
        var requires = new Array();
        let depens = pkgJsonObj.dependencies;

        let peerDepens = pkgJsonObj.peerDependencies;
        let seismicDepens = pkgJsonObj.seismicDependencies;
        if (depens) {
            for (const key in depens) {
                if (webpackModuleArray.includes(key)) {
                    requires.push(key + "@" + depens[key]);
                }
            }
        }
        if (peerDepens) {
            for (const key in peerDepens) {
                if (webpackModuleArray.includes(key)) {
                    requires.push(key + "@" + peerDepens[key]);
                }
            }
        }
        if (seismicDepens) {
            for (const key in seismicDepens) {
                if (webpackModuleArray.includes(key)) {
                    requires.push(key + "@" + seismicDepens[key])
                }
            }
        }
        let ret = pkghelper.delRepeat(requires).filter(d => d);
        return ret;
    }
    //get async dependencies
    static getDependencies(seismicDependencies) {
        let ret = new Array();
        if (seismicDependencies) {
            for (const key in seismicDependencies) {
                ret.push(key + "@" + seismicDependencies[key]);
            }
            //ret = seismicDependencies;
        }
        return ret;
    }

    static getPkgNameAfterFilter(loadPackageStr, seismicLoadPkgFuncName) {
        let ret = "";
        let fullPkgName = "";
        let fullVersion = "";
        if (loadPackageStr) {
            fullPkgName = loadPackageStr.replace(seismicLoadPkgFuncName, '');
            fullPkgName = fullPkgName.replace('(', '').replace(')', '').replace('\\', '').replace('\\', '');
            fullPkgName = fullPkgName.replace(/\r\n/g, '').trim();
            let obj = eval(fullPkgName);
            if (typeof obj == "string") {
                fullVersion = this.getPkgName(obj);
                ret = "('" + fullVersion + "')";
            } else {
                fullVersion = "([";
                for (let i = 0; i < obj.length; i++) {
                    fullVersion += "'" + this.getPkgName(obj[i]) + "'" + ","
                }

                fullVersion = fullVersion.substring(0, fullVersion.length - 1);
                fullVersion += "])";

                ret = fullVersion;
            }
        }

        return ret;
    }

    static getPkgName(fullPkgName) {
        let item = {};
        if (fullPkgName.indexOf('/') != -1) {
            item.pkgName = fullPkgName.split('/')[0];
            item.subPkgName = fullPkgName.replace(item.pkgName, "");
        } else {
            item.pkgName = fullPkgName;
            item.subPkgName = "";
        }
        let pkgobj = pkghelper.getLocalPackageJson();
        let fullVersion = pkghelper.getDependVersion(pkgobj, item.pkgName);
        if (!fullVersion) {
            throw new NotFoundKeyInDependenciesNodeError(item.pkgName);
        }
        if (item.subPkgName) {
            fullVersion = fullVersion + item.subPkgName;
        }

        return fullVersion;
    }

    static delRepeat(ary) {
        ary.sort();
        var n = [ary[0]];
        for (var i = 1; i < ary.length; i++) {
            if (ary[i] !== n[n.length - 1]) {
                n.push(ary[i]);
            }
        }
        return n;
    }

    static delRepeatByObj(ary, key) {
        ary.sort(this.compare(key));
        var n = [ary[0]];
        for (var i = 1; i < ary.length; i++) {
            if (ary[i][key] !== n[n.length - 1][key]) {
                n.push(ary[i]);
            }
        }
        return n;
    }

    static compare(prop) {
        return function (obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop]; if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}

module.exports = pkghelper;