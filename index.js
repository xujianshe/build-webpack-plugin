const pkghelper = require('./plugins/pkghelper');
const SeismicExternalModulePlugin = require('./plugins/webpack3/seismic-external-module-plugin');
const SeismicScriptReplacePlugin = require('./plugins/webpack3/seismic-script-replace-plugin');
const SeismicManifestPlugin = require('./plugins/webpack3/seismic-manifest-plugin');
const SeismicPublicPathPlugin = require('./plugins/webpack3/seismic-public-path-plugin');
//const SeismicCommonChunkPlugin = require('./plugins/seismic-common-chunk-plugin');
const InvalidPluginParameterError = require('./plugins/errors/InvalidPluginParameterError');
const SeismicConfigValidationPlugin = require('./plugins/webpack3/seismic-config-validation-plugin');
const ParamDuplicationError = require('./plugins/errors/ParamDuplicationError');

class SeismicBuildWebPackagePlugin {
    /**
     * entry of the plug-ins
     * @param {*} options
     * {
     *  external:{
     *      react:"React"
     *      react-dom:"ReactDOM"
     *      },
     *  seismicPackages:["seismic-toolkit"]
     * }
     */
    constructor(customOptions) {
        this.commonExternals = {};
        this.commonPackageArray = [];
        this.seismicPackageArray = [];
        this.pluginName = "seismic-build-webpack-plugin";
        this.seismicLoadPkgFuncName = "__seismicLoadPackage__";

        if (customOptions) {
            if (customOptions && !customOptions.externals && !customOptions.seismicPackages) {
                throw new InvalidPluginParameterError();
            }
        }
        const defaultOptions = this.initDefaultOptions();
        let options = this.megerOption(customOptions, defaultOptions);

        if (options.externals) {
            this.commonExternals = options.externals;
            for (const key in options.externals) {
                this.commonPackageArray.push(key);
            }
        }
        if (options.seismicPackages) {
            this.seismicPackageArray = options.seismicPackages;
        }
        this.checkParameters();
    }

    initDefaultOptions() {
        return {
            externals: {
                'react': "React",
                'react-dom': "ReactDOM",
                'styled-components': "StyledComponents"
            },
            seismicPackages: [
                "seismic-toolkit",
                "seismic-content-manager",
                "seismic-workspace",
                "seismic-user-central",
                "seismic-profilebuilder",
                "seismic-doccenter",
                "seismic-admin-settings",
                "seismic-externalcontentsyncwizard",
                "seismic-user-setting-v2",
                "seismic-engagement-ui",
                "seismic-datasource",
                "seismic-search",
                "seismic-doccenter-v2"
                // "seismic-core-service"
            ]
        }
    }

    apply(compiler) {
        this.execute(compiler);
    }

    execute(compiler) {
        //validate config
        new SeismicConfigValidationPlugin().execute(compiler);

        //generate external module
        new SeismicExternalModulePlugin({ externals: this.commonExternals, compkgs: this.commonPackageArray, seismicpkgs: this.seismicPackageArray }).execute(compiler);

        //extract common chunks
        // new SeismicCommonChunkPlugin({ compkgs: this.commonPackageArray }).execute(compiler);

        new SeismicPublicPathPlugin({
            publicPath: this.initWebpackPath()
        }).execute(compiler);

        // //replace script
        new SeismicScriptReplacePlugin({ regkey: this.seismicLoadPkgFuncName }).execute(compiler);

        // //generate manifest file
        new SeismicManifestPlugin({ compkgs: this.commonPackageArray, seismicpkgs: this.seismicPackageArray }).execute(compiler);
    }

    checkParameters() {
        if (this.commonPackageArray && this.seismicPackageArray) {
            for (let i = 0; i < this.commonPackageArray.length; i++) {
                if (this.seismicPackageArray.includes(this.commonPackageArray[i])) {
                    throw new ParamDuplicationError(this.commonPackageArray[i]);
                }
            }
        }
    }

    megerOption(customOptions, defaultOptions) {
        let ret = {};

        if (!customOptions) return defaultOptions;

        let customExternals = customOptions.externals;
        if (!customExternals) customExternals = {};
        ret.externals = Object.assign(defaultOptions.externals, customExternals);

        let customSeismicPackages = customOptions.seismicPackages;
        if (customSeismicPackages) {
            ret.seismicPackages = customSeismicPackages.concat(defaultOptions.seismicPackages);
        } else {
            ret.seismicPackages = defaultOptions.seismicPackages;
        }
        ret.seismicPackages = pkghelper.delRepeat(ret.seismicPackages);

        return ret;
    }

    initWebpackPath() {
        let path = `
        (function () {
            var g = typeof window != 'undefined' && window.Math == Math
                ? window
                : typeof self != 'undefined' && self.Math == Math
                    ? self
                    : Function('return this')();
                    return g.__cdn_url__;
                })()`

        return path;
    }
}

module.exports = SeismicBuildWebPackagePlugin;