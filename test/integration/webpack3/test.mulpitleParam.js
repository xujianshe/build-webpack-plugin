const webpack = require('webpack');
const config = require('./webpack.config');
const path = require('path');
const pkghelper = require('../../../plugins/pkghelper');
const fs = require("fs");
const testhelper = require("./test-helper");
const assert = require('chai').assert;
const testDir = "multiple-param";
//mocha
let webpack_status;

clearDistFolder();
describe('run webpack.config', function () {
    before(function (done) {
        webpack(config, (err, status) => {
            if (err) {
                throw new Error(err);
            }
            webpack_status = status;
            done();
        })
    });

    it("test manifest for the existence of manifest file", () => {
        test_manifest_isExisted(webpack_status);
    })

    it("test manifest node", () => {
        test_manifest_checkNodes(webpack_status);
    })

    it("test manifest js node", () => {
        test_manifest_checkJs(webpack_status);
    })

    it("test manifest requires", () => {
        test_manifest_checkRequires(webpack_status)
    })

    it("test manifest dependencies", () => {
        test_manifest_checkDependencies(webpack_status);
    })

    it("test external modules ：the react", () => {
        test_externals_isGeneratedReact(webpack_status);
    })

    it("test external modules : the react-dom", () => {
        test_externals_isGeneratedReactDOM(webpack_status);
    })

    it("test external modules : the seismic-toolkit", () => {
        test_externals_isGeneratedSeismicToolkit(webpack_status);
    })

    it("test external modules : the sub seismic-toolkit", () => {
        test_externals_isGeneratedSubSeismicToolkit(webpack_status);
    })

    it("test async load with sub single library", () => {
        test_asyncLoad_subsingleLibrary(webpack_status);
    })

    it("test async load with single library", () => {
        test_asyncLoad_singleLibrary(webpack_status);
    })

    it("test async load with multiple library", () => {
        test_asyncLoad_multipleLibrary(webpack_status);
    })
});

function clearDistFolder() {
    var folder_exists = fs.existsSync('dist/' + testDir);
    if (folder_exists == true) {
        let dirList = fs.readdirSync('dist/' + testDir);

        dirList.forEach(function (fileName) {
            fs.unlinkSync(path.join('dist', testDir, fileName));
        });
    }
}

function test_manifest_isExisted(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());

    fs.exists(manifestFilePath, function (exists) {
        assert.isTrue(exists);
    })
}

function test_manifest_checkNodes(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    if (manifest[testhelper.getPkgFullVersion()] && manifest[testhelper.getPkgFullVersion() + '/sample']) {
        assert.isTrue(true);
    } else {
        assert.isTrue(false);
    }
}

function test_manifest_checkJs(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    let firstNode = manifest[testhelper.getPkgFullVersion()];
    if (!firstNode) {
        assert.isOk(false);
    } else {
        let jsName = firstNode["js"][0];
        let context = status.compilation.options.context;
        let jsPath = path.join(context, "dist", testDir, jsName);
        fs.exists(jsPath, function (exists) {
            assert.isTrue(exists);
        })
    }
}

function test_manifest_checkRequires(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    let firstNode = manifest[testhelper.getPkgFullVersion()];
    if (!firstNode) {
        assert.isTrue(false);
    } else {
        let requires = firstNode["requires"];
        if (requires && requires.length > 0) {
            if (!requires.includes(testhelper.getFullVersion('react-dom'))) {
                assert.isTrue(false);
            }
            if (!requires.includes(testhelper.getFullVersion('react'))) {
                assert.isTrue(false);
            }
            if (!requires.includes(testhelper.getFullVersion('seismic-toolkit'))) {
                assert.isTrue(false);
            }
            if (!requires.includes(testhelper.getFullVersion('seismic-toolkit') + "/lib/moduleExport")) {
                assert.isTrue(false);
            }

            assert.isTrue(true);
        } else {
            assert.isTrue(false);
        }
    }
}

function test_manifest_checkDependencies(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    let firstNode = manifest[testhelper.getPkgFullVersion()];
    if (!firstNode) {
        assert.isTrue(false);
    } else {
        let dependencies = firstNode["dependencies"];
        if (dependencies && dependencies.length > 0) {
            if (!dependencies.includes(testhelper.getFullVersion('seismic-toolkit') + "/lib/globalStyle")) {
                assert.isTrue(false);
            }
            if (!dependencies.includes(testhelper.getFullVersion('seismic-toolkit'))) {
                assert.isTrue(false);
            }
            assert.isTrue(true);
        } else {
            assert.isTrue(false);
        }
    }
}

function test_externals_isGeneratedReact(status) {
    let modules = status.compilation._modules;
    let expectStr = 'external "React"';
    if (modules[expectStr]) {
        assert.isTrue(true);
    } else {
        assert.isTrue(false);
    }
}

function test_externals_isGeneratedReactDOM(status) {
    let modules = status.compilation._modules;
    let expectStr = 'external "ReactDOM"';
    if (modules[expectStr]) {
        assert.isTrue(true);
    } else {
        assert.isTrue(false);
    }
}

function test_externals_isGeneratedSeismicToolkit(status) {
    let modules = status.compilation._modules;
    let expectStr = 'external "window.__global_module_registers__[\'seismic-toolkit@^3.14.0\']"';
    if (modules[expectStr]) {
        assert.isTrue(true);
    } else {
        assert.isTrue(false);
    }
}

function test_externals_isGeneratedSubSeismicToolkit(status) {
    let modules = status.compilation._modules;
    let expectStr = 'external "window.__global_module_registers__[\'seismic-toolkit@^3.14.0/lib/moduleExport\']"';
    if (modules[expectStr]) {
        assert.isTrue(true);
    } else {
        assert.isTrue(false);
    }
}

function test_asyncLoad_subsingleLibrary(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    let firstNode = manifest[testhelper.getPkgFullVersion()];
    if (!firstNode) {
        assert.isTrue(false);
    } else {
        let jsName = firstNode["js"][0];
        let context = status.compilation.options.context;
        let jsPath = path.join(context, "dist", testDir, jsName);
        fs.exists(jsPath, function (exists) {
            if (!exists) {
                assert.isTrue(false);
            } else {
                let data = fs.readFileSync(jsPath).toString();
                if (data.indexOf("__seismicLoadPackage__('seismic-toolkit@^3.14.0/lib/globalStyle')") != -1) {
                    assert.isTrue(true);
                } else {
                    assert.isTrue(false);
                }
            }
        })
    }
}

function test_asyncLoad_singleLibrary(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    let firstNode = manifest[testhelper.getPkgFullVersion()];
    if (!firstNode) {
        assert.isTrue(false);
    } else {
        let jsName = firstNode["js"][0];
        let context = status.compilation.options.context;
        let jsPath = path.join(context, "dist", testDir, jsName);
        fs.exists(jsPath, function (exists) {
            if (!exists) {
                assert.isTrue(false);
            } else {
                let data = fs.readFileSync(jsPath).toString();
                if (data.indexOf("__seismicLoadPackage__('seismic-toolkit@^3.14.0')") != -1) {
                    assert.isTrue(true);
                } else {
                    assert.isTrue(false);
                }
            }
        })
    }
}

function test_asyncLoad_multipleLibrary(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    let firstNode = manifest[testhelper.getPkgFullVersion()];
    if (!firstNode) {
        assert.isTrue(false);
    } else {
        let jsName = firstNode["js"][0];
        let context = status.compilation.options.context;
        let jsPath = path.join(context, "dist", testDir, jsName);
        fs.exists(jsPath, function (exists) {
            if (!exists) {
                assert.isTrue(false);
            } else {
                let data = fs.readFileSync(jsPath).toString();
                if (data.indexOf("__seismicLoadPackage__(['seismic-toolkit@^3.14.0','seismic-toolkit@^3.14.0/lib/globalStyle'])") != -1) {
                    assert.isTrue(true);
                } else {
                    assert.isTrue(false);
                }
            }
        })
    }
}


