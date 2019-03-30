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
            (compilation, callback) => {
                const context = compiler.options.context;
                let filename = "";
                let entryChunks = [];
                let commonChunks = [];
                let extractedCommonChunks = [];
                let cssChunks = [];
                let otherChunks = [];

                this.fillCssAndOthers(compilation, cssChunks, otherChunks);
                this.fillEntryChunksAndCommonChunks(compilation, entryChunks, commonChunks);
                this.fillExtractedChunkArray(entryChunks, extractedCommonChunks);

                let manifest = {}, fullVersion = "", fullVersionObj = {};
                let pkgJsonObj = pkghelper.getLocalPackageJson();
                filename = pkgJsonObj.name + ".manifest." + pkgJsonObj.version + ".json";
                //creat the entry chunks of manifest
                let tempVersion = pkghelper.getFullVersion(pkgJsonObj);
                if (entryChunks.length == 1) {
                    let requireModules = this.fillModuleArray(entryChunks[0], context);
                    let dependencyModules = global[entryChunks[0].name];

                    fullVersion = tempVersion;
                    fullVersionObj = pkghelper.getEntryFullVersionObj(pkgJsonObj, this.commonPackageArray, this.seismicPackageArray, requireModules, dependencyModules, this.formatFileName(entryChunks[0].files[0]));
                    this.appendExtractedChunksForRequires(fullVersionObj, entryChunks[0], tempVersion);
                    this.appendCssManifest(fullVersionObj, cssChunks);
                    this.appendAssetsManifest(fullVersionObj, otherChunks);
                    manifest[fullVersion] = fullVersionObj;
                    if (entryChunks[0].name != "main") {
                        fullVersion = tempVersion + "/" + entryChunks[0].name;
                        fullVersionObj = pkghelper.getEntryFullVersionObj(pkgJsonObj, this.commonPackageArray, this.seismicPackageArray, requireModules, dependencyModules, this.formatFileName(entryChunks[0].files[0]));
                        this.appendExtractedChunksForRequires(fullVersionObj, entryChunks[0], tempVersion);
                        this.appendCssManifest(fullVersionObj, cssChunks);
                        this.appendAssetsManifest(fullVersionObj, otherChunks);
                        manifest[fullVersion] = fullVersionObj;
                    }
                    //clear global[entryChunks[0]]
                    global[entryChunks[0].name] = null;
                } else {
                    for (let i = 0; i < entryChunks.length; i++) {
                        let requireModules = this.fillModuleArray(entryChunks[i], context);
                        let dependencyModules = global[entryChunks[i].name];

                        fullVersion = tempVersion + "/" + entryChunks[i].name;
                        let outPutFileName = this.formatFileName(entryChunks[i].files[0]);
                        //append js，requires,dependencies
                        fullVersionObj = pkghelper.getEntryFullVersionObj(pkgJsonObj, this.commonPackageArray, this.seismicPackageArray, requireModules, dependencyModules, outPutFileName);
                        this.appendExtractedChunksForRequires(fullVersionObj, entryChunks[i], tempVersion);
                        //append css
                        this.appendCssManifest(fullVersionObj, cssChunks);
                        //append others

                        this.appendAssetsManifest(fullVersionObj, otherChunks);
                        manifest[fullVersion] = fullVersionObj;
                        //clear global[entryChunks[i]]
                        global[entryChunks[i].name] = null;
                    }
                }
                //append extracted Common chunks
                this.appendExtractedChunkNodesForManifest(pkgJsonObj, manifest, extractedCommonChunks, tempVersion, cssChunks, context);
                //rename entryChunks output
                this.renameEntryChunks(compilation, entryChunks);
                //rename commchunks output
                //this.renameCommonChunks(compilation, commonChunks);
                //create ManifestInfo
                let manifestInfo = this.createManifestInfo(commonChunks, entryChunks, manifest);
                //merge manifest
                let newManifest = this.mergeManifest(manifestInfo);
                //build manifest.json
                this.buildManifestAssets(compilation, filename, newManifest);

                callback();
            });
    }

    formatFileName(fileName) {
        return fileName.replace(/\//g, "-");
    }

    fillEntryChunksAndCommonChunks(compilation, entryChunks, commonChunks) {
        // let compkgs = this.commonPackageArray;
        compilation.chunks.forEach(function (item) {
            if (item.entryModule) {
                entryChunks.push(item);
            }
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
                case ".html":
                    otherChunks.push(key);
                    break;
            }
        }
    }

    fillModuleArray(chunk, context) {
        let moduleArray = [];
        chunk.forEachModule((module) => {
            if (module.libIdent) {
                module.id = module.libIdent({ context });
                moduleArray.push(module.id);
            }
        });

        return moduleArray;
    }

    fillExtractedChunkArray(entryChunks, extractedCommonChunks) {
        for (let i = 0; i < entryChunks.length; i++) {
            if (entryChunks[i].parents && entryChunks[i].parents.length > 0) {
                entryChunks[i].parents.forEach(element => {
                    extractedCommonChunks.push(element);
                });
            }
        }

        extractedCommonChunks = pkghelper.delRepeatByObj(extractedCommonChunks, "name");
    }

    appendExtractedChunkNodesForManifest(pkgJsonObj, manifest, extractedCommonChunks, packageFullVersionName, cssChunks, context) {
        for (let i = 0; i < extractedCommonChunks.length; i++) {
            this.RecurseExtractedChunkForManifest(extractedCommonChunks[i], pkgJsonObj, manifest, packageFullVersionName, cssChunks, context);
        }
    }

    RecurseExtractedChunkForManifest(extractedCommonChunk, pkgJsonObj, manifest, packageFullVersionName, cssChunks, context) {
        let requireModules = this.fillModuleArray(extractedCommonChunk, context);  //let requireModules = [];
        let fullVersion = packageFullVersionName + "/" + extractedCommonChunk.name;
        let outPutFileName = this.formatFileName(extractedCommonChunk.files[0]);
        let fullVersionObj = pkghelper.getEntryFullVersionObj(pkgJsonObj, this.commonPackageArray, this.seismicPackageArray, requireModules, null, outPutFileName);
        this.appendCssManifest(fullVersionObj, cssChunks);
        manifest[fullVersion] = fullVersionObj;

        if (extractedCommonChunk.parents && extractedCommonChunk.parents.length > 0) {
            extractedCommonChunk.parents.forEach(element => {
                let tempVersion = pkghelper.getFullVersion(pkgJsonObj);
                this.appendExtractedChunksForRequires(fullVersionObj, extractedCommonChunk, tempVersion);
                manifest[fullVersion] = fullVersionObj;

                this.RecurseExtractedChunkForManifest(element, pkgJsonObj, manifest, packageFullVersionName, cssChunks, context);
            })
        }
    }

    appendExtractedChunksForRequires(nodeObj, entryChunk, packageFullVersionName) {
        if (entryChunk) {
            if (entryChunk.parents && entryChunk.parents.length > 0) {
                let parentChunks = entryChunk.parents;
                if (nodeObj) {
                    if (!nodeObj.requires) nodeObj.requires = [];
                    for (let i = 0; i < parentChunks.length; i++) {
                        let fullName = packageFullVersionName + "/" + parentChunks[0].name;
                        nodeObj.requires.push(fullName);
                    }
                }
            }
        }
    }

    appendCssManifest(fullVersionObj, cssChunks) {
        if (!cssChunks.length) return;

        let jsFilesNames = fullVersionObj["js"];
        let cssFileNames = new Array();
        for (let i = 0; i < cssChunks.length; i++) {
            if (cssChunks[i]) {
                let formatCssName = this.formatCssName(cssChunks[i]);
                for (let j = 0; j < jsFilesNames.length; j++) {
                    if (jsFilesNames[j].indexOf(formatCssName) != -1) {
                        cssFileNames.push(cssChunks[i]);
                        break;
                    }
                }
            }
        }
        if (cssFileNames.length > 0) {
            fullVersionObj["css"] = cssFileNames;
        }
    }

    formatCssName(cssName) {
        let ret = '';
        let tempNames = cssName.split('.');
        if (tempNames.length > 2) {
            let filterName = cssName.replace('.' + tempNames[tempNames.length - 1], '').replace('.' + tempNames[tempNames.length - 2], '');
            ret = filterName;
        }

        return ret;
    }

    appendAssetsManifest(fullVersionObj, otherChunks) {
        if (!otherChunks.length) return;

        let assetsFileNames = new Array();
        for (let i = 0; i < otherChunks.length; i++) {
            assetsFileNames.push(otherChunks[i]);
        }
        fullVersionObj["deprecated_html"] = assetsFileNames;
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
        //merge manifest detail
        for (const key in manifestInfoB.manifest) {
            // if (!manifestInfoA.manifest[key]) {
            manifestInfoA.manifest[key] = manifestInfoB.manifest[key];
            // }
        }
        //merge commonchunks
        manifestInfoA.commonChunkNames = pkghelper.delRepeat(manifestInfoA.commonChunkNames.concat(manifestInfoB.commonChunkNames));
        //merge entryChunkNames
        manifestInfoA.entryChunkNames = pkghelper.delRepeat(manifestInfoA.entryChunkNames.concat(manifestInfoB.entryChunkNames));

        return manifestInfoA;
    }

    renameEntryChunks(compilation, entryChunks) {
        for (let i = 0; i < entryChunks.length; i++) {
            let fileName = entryChunks[i].files[0];
            if (fileName.indexOf('/') != -1) {
                let newFileName = this.formatFileName(fileName);
                if (compilation.assets[fileName]) {
                    compilation.assets[newFileName] = compilation.assets[fileName];
                    delete compilation.assets[fileName];
                }
            }
        }
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
                return JSON.stringify(manifest, null, 2);
            },
            size: function size() {
                return JSON.stringify(manifest, null, 2).length;
            }
        };
    }
}

module.exports = SeismicManifestPlugin;