
class SeismicPublicPathPlugin {
    constructor(options) {
        if (options && options.publicPath) {
            this.publicPath = options.publicPath;
        }
        this.pluginName = "seismic-public-path-plugin";
    }

    apply(compiler) {
        this.execute(compiler);
    }

    execute(compiler) {
        let path=this.publicPath;
        compiler.plugin('compilation', function (compilation) {
            compilation.mainTemplate.plugin('require-extensions',  (source, chunk, hash)=> {
                return buf(path, source);
            });
        });
    }
}

function buf(path, source) {
    var buf = [];
    buf.push(source);
    buf.push('');
    buf.push('// Dynamic assets path override');
    buf.push('__webpack_require__.p = (' + path + ') || __webpack_require__.p;');
    return buf.join('\n');
}

module.exports=SeismicPublicPathPlugin;