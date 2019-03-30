const pkghelper = require('../pkghelper')
const fs = require("fs");
const path = require("path");

/**
 * generate manifest.json
 */
class SeismicManifestPlugin {
    constructor(options) {
        this.commonPackageArray = new Array();
        this.seismicPackageArray = new Array();

        this.pluginName = "seismic-manifest-plugin";
        if (!options) {
            throw Error("the plugin requires a parameter");
        }
        this.commonPackageArray = options.compkgs;
        this.seismicPackageArray = options.seismicpkgs;
    }

    apply(compiler) {
        this.execute(compiler);
    }

    execute(compiler) {
        compiler.plugin("emit",
            // compiler.hooks.emit.tap(
            //     this.pluginName,
            (compilation, callback) => {
                const context = compiler.options.context;
                let filename = "";
                let moduleArray = [];
                let entryChunks = [];
                let commonChunks = [];
                let cssChunks = [];
                let otherChunks = [];

                this.fillCssAndOthers(compilation, cssChunks, otherChunks);
                this.fillEntryChunksAndCommonChunks(compilation, entryChunks, commonChunks);
                this.fillModuleArray(compilation, moduleArray, context);

                let manifest = {}, fullVersion = "", fullVersionObj = {};
                let pkgJsonObj = pkghelper.getLocalPackageJson();
                filename = pkgJsonObj.name + ".manifest." + pkgJsonObj.version + ".json";
                //creat the entry chunks of manifest
                let tempVersion = pkghelper.getFullVersion(pkgJsonObj);
                for (let i = 0; i < entryChunks.length; i++) {
                    if (entryChunks.length == 1) {
                        fullVersion = tempVersion;
                    } else {
                        fullVersion = tempVersion + "/" + entryChunks[i].name;
                    }
                    let outPutFileName = entryChunks[i].files[0];
                    //append js，requires,dependencies
                    fullVersionObj = pkghelper.getEntryFullVersionObj(pkgJsonObj, this.commonPackageArray, this.seismicPackageArray, moduleArray, outPutFileName);
                    //append css
                    this.appendCssManifest(fullVersionObj, cssChunks);
                    //append assets
                    // this.appendAssetsManifest(fullVersionObj, otherChunks);
                    manifest[fullVersion] = fullVersionObj;
                }

                //creat the common chunks of manifest                
                // for (var i = 0; i < commonChunks.length; i++) {
                //     pkgJsonObj = pkghelper.getNodeModulePackageJson(commonChunks[i].name);
                //     fullVersion = pkghelper.getFullVersion(pkgJsonObj);

                //     if (commonChunks[i].hash) {
                //         let hash = commonChunks[i].hash.length > 20 ? commonChunks[i].hash.substring(0, 20) : commonChunks[i].hash;
                //         fullVersionObj = pkghelper.getFullVersionObj(pkgJsonObj, this.commonPackageArray, hash);

                //         manifest[fullVersion] = fullVersionObj;
                //     }
                // }

                //rename commchunks output
                this.renameCommonChunks(compilation, commonChunks);
                //create ManifestInfo
                let manifestInfo = this.createManifestInfo(commonChunks, entryChunks, manifest);
                //merge manifest
                let newManifest = this.mergeManifest(manifestInfo);
                //build manifest.json
                this.buildManifestAssets(compilation, filename, newManifest);

                callback()
            });
    }

    fillEntryChunksAndCommonChunks(compilation, entryChunks, commonChunks) {
        let compkgs = this.commonPackageArray;
        //console.log("compilation.chunks====>" + compilation.chunks);
        compilation.chunks.forEach(function (item) {
            entryChunks.push(item);
            // if (!compkgs.includes(item["name"])) {
            //     entryChunks.push(item["chunks"][0]);
            // } else {
            //     commonChunks.push(item["chunks"][0]);
            // }
        });
    }

    fillCssAndOthers(compilation, cssChunks, otherChunks) {
        let extName = "";
        for (const key in compilation.assets) {
            extName = path.extname(key);
            switch (extName) {
                case ".css":
                    cssChunks.push(key);
                    break;
                case ".js":
                    break;
                default:
                    //otherChunks.push(key);
                    break;
            }
        }
    }

    fillModuleArray(compilation, moduleArray, context) {
        for (const module of compilation.modules) {
            console.log("module.request==>" + module.request);
            if (module.request == "React") {
                for (const key in module) {
                    console.log("key===>" + key + "  ,value==>" + module[key]);
                }
            }

            if (module.libIdent) {
                module.id = module.libIdent({ context });

                moduleArray.push(module.id);
            }
        }
    }

    appendCssManifest(fullVersionObj, cssChunks) {
        if (!cssChunks.length) return;

        let cssFileNames = new Array();
        for (let i = 0; i < cssChunks.length; i++) {
            cssFileNames.push(cssChunks[i]);
        }
        fullVersionObj["css"] = cssFileNames;
    }

    appendAssetsManifest(fullVersionObj, otherChunks) {
        let assetsFileNames = new Array();
        for (let i = 0; i < otherChunks.length; i++) {
            assetsFileNames.push(otherChunks[i]);
        }
        fullVersionObj["assets"] = assetsFileNames;
    }

    createManifestInfo(commonChunks, entryChunks, manifest) {
        let manifestInfo = {};

        let pkgJsonObj = pkghelper.getLocalPackageJson();
        manifestInfo.packageName = pkgJsonObj.name;

        manifestInfo.commonChunkNames = new Array();
        for (let i = 0; i < commonChunks.length; i++) {
            manifestInfo.commonChunkNames.push(commonChunks[i].name);
        }

        manifestInfo.entryChunkNames = new Array();
        for (let i = 0; i < entryChunks.length; i++) {
            manifestInfo.entryChunkNames.push(entryChunks[i].name);
        }

        manifestInfo.manifest = manifest;

        return manifestInfo;
    }

    //manifestInfo(commonChunkNames,entryChunkName,packageName,manifest)
    mergeManifest(manifestInfo) {
        if (!global.manifestInfo) {
            global.manifestInfo = manifestInfo;
            return manifestInfo.manifest;
        }
        let previousManifestInfo = global.manifestInfo;
        global.manifestInfo = this.mergeJson(previousManifestInfo, manifestInfo);
        return global.manifestInfo.manifest;
    }

    mergeJson(manifestInfoA, manifestInfoB) {
        if (manifestInfoB) {
            let localPkgObj = pkghelper.getLocalPackageJson();
            let mainKey = localPkgObj.name + "@" + localPkgObj.version;
            if (manifestInfoA.manifest[mainKey]) {
                let newMainKey = mainKey + "/" + manifestInfoA.entryChunkNames[0];
                manifestInfoA.manifest[newMainKey] = manifestInfoA.manifest[mainKey];
                delete manifestInfoA.manifest[mainKey];
            }
            if (manifestInfoB.manifest[mainKey]) {
                let newMainKey = mainKey + "/" + manifestInfoB.entryChunkNames[0];
                manifestInfoB.manifest[newMainKey] = manifestInfoB.manifest[mainKey];
                delete manifestInfoB.manifest[mainKey];
            }
        }
        //merge manifest detail
        for (const key in manifestInfoB.manifest) {
            if (!manifestInfoA.manifest[key]) {
                manifestInfoA.manifest[key] = manifestInfoB.manifest[key];
            }
        }
        //merge commonchunks
        manifestInfoA.commonChunkNames = pkghelper.delRepeat(manifestInfoA.commonChunkNames.concat(manifestInfoB.commonChunkNames));
        //merge entryChunkNames
        manifestInfoA.entryChunkNames = pkghelper.delRepeat(manifestInfoA.entryChunkNames.concat(manifestInfoB.entryChunkNames));

        return manifestInfoA;
    }

    renameCommonChunks(compilation, commonChunks) {
        for (let i = 0; i < commonChunks.length; i++) {
            let fileName = commonChunks[i].files[0];
            if (compilation.assets[fileName]) {
                let newFileName = pkghelper.getCommonChunkFileName(commonChunks[i]);
                compilation.assets[newFileName] = compilation.assets[fileName];
                delete compilation.assets[fileName];
            }
        }
    }

    buildManifestAssets(compilation, filename, manifest) {
        compilation.assets[filename] = {
            source: function source() {
                return JSON.stringify(manifest);
            },
            size: function size() {
                return JSON.stringify(manifest).length;
            }
        };
    }
}

module.exports = SeismicManifestPlugin;