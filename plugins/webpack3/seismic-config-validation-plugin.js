const msghelper = require('../msghelper');

/**
 * seismic config validation plugin
 */
class SeismicConfigValidationPlugin {
    constructor() {
        this.pluginName = "seismic-config-validation-plugin";
    }

    apply(compiler) {
        this.execute(compiler);
    }

    execute(compiler) {
        let options = compiler.options;
        if (options) {
            let output = options.output;
            if (output) {
                let library = output.library;
                if (!library) {
                    console.warn(msghelper.getLibraryNotFoundWarning());
                }
            }
        }
    }
}

module.exports = SeismicConfigValidationPlugin;