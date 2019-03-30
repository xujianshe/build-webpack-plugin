const ExternalModule = require('webpack/lib/ExternalModule');
class MyDynamicCdnWebpackPlugin {
    constructor() {

    }

    apply(compiler) {
        if (!this.disable) {
            this.execute(compiler);
        }
    }

    execute(compiler) {
        compiler.plugin("normal-module-factory", nmf => {
            nmf.plugin("factory", factory => async (data, cb) => {
                const modulePath = data.dependencies[0].request;
                if (modulePath == "react") {
                    cb(null, new ExternalModule("React", 'var', modulePath));
                }
                if (modulePath == "react-dom") {
                    cb(null, new ExternalModule("ReactDOM", 'var', modulePath));
                } else {
                    factory(data, cb);
                }
            });
        });
    }
}
module.exports = MyDynamicCdnWebpackPlugin;