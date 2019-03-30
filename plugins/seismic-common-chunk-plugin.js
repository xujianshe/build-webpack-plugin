const ExternalModule = require('webpack/lib/ExternalModule');
const pkghelper = require('./pkghelper');
const GraphHelpers = require("webpack/lib/GraphHelpers");
const Entrypoint = require('webpack/lib/Entrypoint');
const CommonJsRequireContextDependency = require('webpack/lib/dependencies/CommonJsRequireContextDependency');
const NormalModule = require('webpack/lib/NormalModule');

/**
 * extract common libs
 */
class SeismicCommonChunkPlugin {
    constructor(options) {
        this.commonPackageArray = new Array();

        if (!options) {
            throw Error("the plugin requires a parameter");
        }
        if (options.compkgs) {
            this.commonPackageArray = options.compkgs;
        }

        this.pluginName = "seismic-common-chunk-plugin";
        this.localPkgObj = pkghelper.getLocalPackageJson();
    }

    apply(compiler) {
        this.execute(compiler);
    }

    execute(compiler) {
        /**
         * 1.extract common libs
         * 2.create external modules for entry chunk and remove common libs
         * 3.repaire the entry chunk
         * 4.ensure dependedcy  for common libs
         * 5.create external modules for common libs
         * 6.create entry point for common libs
         */
        compiler.hooks.thisCompilation.tap(this.pluginName, compilation => {
            compilation.hooks.optimizeChunksAdvanced.tap(this.pluginName, chunks => {
                let allNewChunkInfoArray = new Array();
                let chunkLength = chunks.length;
                for (let i = 0; i < chunkLength; i++) {
                    let entryChunk = chunks[i];
                    let newChunkInfoArray = this.extractCommonLibs(compilation, entryChunk);
                    this.createEntryPointExternamlModule(compilation, entryChunk, newChunkInfoArray);
                    this.repairCommonChunk(entryChunk);
                    allNewChunkInfoArray = allNewChunkInfoArray.concat(newChunkInfoArray);
                }
                allNewChunkInfoArray = pkghelper.delRepeatByObj(allNewChunkInfoArray, "entryRequest");
                this.createCommonLibsExternalModule(compilation, allNewChunkInfoArray);
                this.createNewEntryPoint(compilation, allNewChunkInfoArray);
            })
        })
    }

    extractCommonLibs(compilation, entryChunk) {
        let commonEntryModules = this.getCommonEntryModules(entryChunk);
        let newChunkInfoArray = this.extractAndReomve(compilation, entryChunk, commonEntryModules);
        //this.repairCommonChunk(entryChunk);

        return newChunkInfoArray;
    }

    getCommonEntryModules(entryChunk) {
        let commonEntryModules = [];
        for (const module of entryChunk.modulesIterable) {
            if (module.rawRequest) {
                if (this.commonPackageArray.includes(module.rawRequest.toLowerCase())) {
                    commonEntryModules.push(module);
                }
            }
        }
        commonEntryModules = pkghelper.delRepeatByObj(commonEntryModules, "request").filter(d => d);

        return commonEntryModules;
    }

    extractAndReomve(compilation, entryChunk, commonEntryModules) {
        let newChunkInfoArray = new Array();
        for (let i = 0; i < commonEntryModules.length; i++) {
            let refModule = commonEntryModules[i];
            let libName = commonEntryModules[i].rawRequest;
            let newChunk = compilation.addChunk(libName);
            newChunk.entryModule = commonEntryModules[i];

            if (!refModule.resource) {
                continue;
            }

            let depends = new Map();
            depends.set(refModule.resource, refModule);
            this.getDependencies(refModule, depends);
            let retDepends = [...depends.values()];

            for (let j = 0; j < retDepends.length; j++) {
                newChunk.addModule(retDepends[j]);
                if (!retDepends[j].seismicNotDeleted) {
                    entryChunk.removeModule(retDepends[j]);
                }
            }
            let chunkInfo = new Object();
            chunkInfo.chunk = newChunk;
            chunkInfo.entryRequest = refModule.request;
            chunkInfo.modules = retDepends;
            newChunkInfoArray.push(chunkInfo);
        }

        return newChunkInfoArray;
    }

    repairCommonChunk(chunk) {
        for (const module of chunk.modulesIterable) {
            // let module = chunk.entryModule;
            if (module.dependencies && module.dependencies.length > 0) {
                for (let i = 0; i < module.dependencies.length; i++) {
                    let refModule = module.dependencies[i].module;
                    let subLibName = module.dependencies[i].request;
                    if (refModule && subLibName) {
                        if (!refModule.resource) {
                            continue;
                        }

                        let depends = new Map();
                        depends.set(refModule.resource, refModule);
                        this.getDependencies(refModule, depends);
                        let retDepends = [...depends.values()]; //pkghelper.delRepeatByObj(depends, "request");
                        for (let j = 0; j < retDepends.length; j++) {
                            if (!chunk.containsModule(retDepends[j])) {
                                chunk.addModule(retDepends[j]);
                            }
                        }
                    }
                }
            }
        }
    }

    createNewEntryPoint(compilation, newChunkInfoArray) {
        for (let i = 0; i < newChunkInfoArray.length; i++) {
            if (!newChunkInfoArray[i]) continue;

            let chunk = newChunkInfoArray[i].chunk;
            let entryModule = chunk.entryModule;
            let libName = chunk.name;
            let ept = new Entrypoint(libName);
            ept.setRuntimeChunk(chunk);
            ept.addOrigin(null, libName, entryModule.request);

            compilation.namedChunkGroups.set(libName, ept);
            compilation.entrypoints.set(libName, ept);
            compilation.chunkGroups.push(ept);

            GraphHelpers.connectChunkGroupAndChunk(ept, chunk);
            GraphHelpers.connectChunkAndModule(chunk, entryModule);

            chunk.entryModule = entryModule;
            chunk.name = libName;

            compilation.assignDepth(entryModule);
        }
    }

    getDependencies(refModule, depends) {
        if (!refModule) {
            return;
        }
        if (!refModule.dependencies) {
            return;
        }
        if (refModule.dependencies.length == 0) {
            return;
        }

        let allDepdences = [];

        if (refModule.dependencies && refModule.dependencies.length > 0) {
            allDepdences = allDepdences.concat(refModule.dependencies);
        }

        if (refModule.variables && refModule.variables.length > 0) {
            let variables = refModule.variables;
            for (let i = 0; i < variables.length; i++) {
                let vdep = variables[i];
                if (vdep.dependencies) {
                    for (let j = 0; j < vdep.dependencies.length; j++) {
                        if (vdep.dependencies[j].module) {
                            vdep.dependencies[j].module.seismicNotDeleted = true;
                        }
                    }
                    allDepdences = allDepdences.concat(vdep.dependencies);
                }
            }
        }
        if (allDepdences.length == 0) {
            return;
        }

        for (let i = 0; i < allDepdences.length; i++) {
            let dependence = allDepdences[i];
            if (dependence.type && dependence.type != "null") {
                let dependModule = dependence.module;
                if (dependModule && dependModule.resource && !depends.has(dependModule.resource)) {
                    depends.set(dependModule.resource, dependModule);
                    this.getDependencies(dependModule, depends);
                }
            }
        }
    }

    getSecondEntryModuleRequest(refModule) {
        let moduleRequests = new Array();
        for (let i = 0; i < refModule.dependencies.length; i++) {
            if (refModule.dependencies[i].type) {
                let depsendModule = refModule.dependencies[i].module;
                if (depsendModule && depsendModule.request) {
                    moduleRequests.push(depsendModule.request);
                }
            }
        }
        moduleRequests = pkghelper.delRepeat(moduleRequests);

        return moduleRequests[0];
    }

    createCommonLibsExternalModule(compilation, commonChunkInfoArray) {
        if (commonChunkInfoArray.length > 1) {
            for (let i = 0; i < commonChunkInfoArray.length; i++) {
                for (let j = i + 1; j < commonChunkInfoArray.length; j++) {
                    this.setDependency(compilation, commonChunkInfoArray[i], commonChunkInfoArray[j]);
                }
            }
        }
    }

    createEntryPointExternamlModule(compilation, entryChunk, newChunkInfoArray) {
        let pkgObj = pkghelper.getLocalPackageJson();

        for (let i = 0; i < newChunkInfoArray.length; i++) {
            let request = this.createExternalRequest(pkgObj, newChunkInfoArray[i].chunk.name);
            let externalModule = this.createAndAddExternalModule(compilation, entryChunk, request, newChunkInfoArray[i].chunk.name);

            //create despends connect with entryChunk
            this.createDependsConnection(entryChunk, externalModule);
        }
    }

    createDependsConnection(entryChunk, externalModule) {
        if (entryChunk) {
            for (const module of entryChunk.modulesIterable) {
                if (!module) continue;

                let depends = module.dependencies;
                if (!depends) {
                    continue;
                }
                if (depends.length > 0) {
                    for (let i = 0; i < depends.length; i++) {
                        if (depends[i].module && depends[i].request) {
                            if (depends[i].request == externalModule.userRequest) {
                                depends[i].module = externalModule;
                            }
                        }
                    }
                }
            }
        }
    }

    //ensure dependency(chunk,entryRequest,modules)
    setDependency(compilation, chunkInfoA, chunkInfoB) {
        if (chunkInfoA.modules.length < chunkInfoB.modules.length) {
            this.setDependencyDetail(compilation, chunkInfoA, chunkInfoB);
        } else {
            this.setDependencyDetail(compilation, chunkInfoB, chunkInfoA);
        }
    }

    setDependencyDetail(compilation, chunkInfoA, chunkInfoB) {
        let ret = false;

        for (let i = 0; i < chunkInfoB.modules.length; i++) {
            if (chunkInfoB.modules[i].request) {
                if (chunkInfoB.modules[i].request == chunkInfoA.entryRequest) {
                    ret = true;
                    break;
                }
            }
        }
        if (ret) {
            for (let i = 0; i < chunkInfoA.modules.length; i++) {
                if (chunkInfoA.modules[i].seismicNotDeleted) {
                    continue;
                }
                chunkInfoB.chunk.removeModule(chunkInfoA.modules[i]);
            }
            //generate the external dependency of chunkA for chunkB
            let pkgObj = pkghelper.getNodeModulePackageJson(chunkInfoB.chunk.name);
            let request = this.createExternalRequest(pkgObj, chunkInfoA.chunk.name);
            let externalModule = this.createAndAddExternalModule(compilation, chunkInfoB.chunk, request, chunkInfoA.chunk.name);

            //create despends connect with common chunks
            this.createDependsConnection(chunkInfoB.chunk, externalModule);

            this.repairCommonChunk(chunkInfoB.chunk);
        }
    }

    createExternalRequest(pkgObj, externalLibName) {
        let fullVersion = pkghelper.getDependVersion(pkgObj, externalLibName);
        return "window.__global_module_registers__['" + fullVersion + "']";
    }

    createAndAddExternalModule(compilation, chunk, request, userRequest) {
        for (let i = 0; i < compilation.modules.length; i++) {
            if (compilation.modules[i].userRequest) {
                if (compilation.modules[i].userRequest == userRequest) {
                    chunk.addModule(compilation.modules[i]);
                    compilation.modules[i].addChunk(chunk);

                    return compilation.modules[i];
                }
            }
        }
        let externalModule = new ExternalModule(request, 'var', userRequest);
        externalModule.built = true;
        externalModule.buildMeta = {};
        externalModule.buildInfo = {};
        GraphHelpers.connectChunkAndModule(chunk, externalModule);
        compilation.modules.push(externalModule);

        return externalModule;
    }
}

module.exports = SeismicCommonChunkPlugin;