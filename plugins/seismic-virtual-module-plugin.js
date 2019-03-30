const path = require('path');
const VirtualModuleProvider = require('./virtual-module-provider');

class SeismicVirtualModulePlugin {
    constructor(options) {
        if (!options || !Array.isArray(options)) {
            throw Error("the plugin requires an array type parameter");
        }
        if (options.length == 0) {
            throw Error("array length must be not 0")
        }
        this.options = options;
    }

    apply(compiler) {
        this.Execute(compiler);
    }

    execute(compiler) {
        let virtualOptions = {};
        virtualOptions.moduleNames = this.options.map((item) => {
            return item;
        });

        const waitForResolvers = !compiler.resolvers.normal;
        if (waitForResolvers) {
            compiler.plugin('after-resolvers', addPlugin);
        } else {
            addPlugin();
        }

        function addPlugin() {
            const useModuleFactory = !compiler.resolvers.normal.plugin;
            if (useModuleFactory) {
                compiler.plugin('normal-module-factory', (nmf) => {
                    nmf.plugin('before-resolve', resolverPlugin);
                });
            } else {
                compiler.resolvers.normal.plugin('before-resolve', resolverPlugin);
            }
        }

        function resolverPlugin(request, cb) {
            // populate the file system cache with the virtual module
            let moduleNames = virtualOptions.moduleNames;
            const fs = (this && this.fileSystem) || compiler.inputFileSystem;
            const join = (this && this.join) || path.join;

            // webpack 1.x compatibility
            if (typeof request === 'string') {
                request = cb;
                cb = null;
            }
            let modulePaths = moduleNames.map((item) => {
                return join(compiler.context, item);
            })
            //let ctime = VirtualModuleProvider.statsDate();
            const resolve = (data) => {
                //VirtualModuleProvider.populateFilesystem({ fs, modulePaths, contents: data, ctime });
            };

            const resolved = Promise.resolve('').then(resolve);
            if (!cb) {
                return;
            }
            resolved.then(() => cb());
        }
    }
}

module.exports = SeismicVirtualModulePlugin;