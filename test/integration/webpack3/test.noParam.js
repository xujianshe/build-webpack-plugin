const webpack = require('webpack');
const config = require('./webpack.config.noParam');
const path = require('path');
const fs = require("fs");
const assert = require('chai').assert;
const testDir = "no-param";
const testhelper = require('./test-helper');
//mocha
let webpack_status;

clearDistFolder();
describe('run webpack.config.noParam', function () {
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

    // it("test manifest no requires", () => {
    //     test_manifest_noRequires(webpack_status);
    // })

    // it("test manifest no dependencies", () => {
    //     test_manifest_noDependencies(webpack_status);
    // })
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

function test_manifest_noRequires(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    let firstNode = manifest[testhelper.getPkgFullVersion()];
    if (!firstNode) {
        assert.isTrue(false);
    } else {
        let requires = firstNode["requires"];
        if (requires) {
            assert.isNotTrue(true);
        } else {
            assert.isNotTrue(false);
        }
    }
}

function test_manifest_noDependencies(status) {
    let context = status.compilation.options.context;
    let manifestFilePath = path.join(context, "dist", testDir, testhelper.getManifestName());
    const manifest = require(manifestFilePath);
    let firstNode = manifest[testhelper.getPkgFullVersion()];
    if (!firstNode) {
        assert.isTrue(false);
    } else {
        let dependencies = firstNode["dependencies"];
        if (dependencies) {
            assert.isNotTrue(true);
        } else {
            assert.isNotTrue(false);
        }
    }
}

