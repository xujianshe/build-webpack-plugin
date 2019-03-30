const pkghelper = require('../../plugins/pkghelper');
const testHelper = require('../test-hepler');
const samplePkgObj = require('./sample/package.json');

test_getNodeModulePackageJson("webpack");

function test_getNodeModulePackageJson(moduleName) {
    let obj = test_getNodeModulePackageJson;

    let ret = pkghelper.getNodeModulePackageJson(moduleName);

    testHelper.assert(obj, ret);
}

function test_getLocalPackageJson() {
    let obj = test_getLocalPackageJson;
    let ret = pkghelper.getLocalPackageJson();

    testHelper.assert(obj, ret);
}

function test_getEntryFullVersionObj() {
    let obj = get_getEntryFullVersionObj;
    let commonPackageArray = ["react", "react-dom"];
    let webpackModuleArray = ["react", "react-dom", "toolkit"];
    let outPutFileNames = "demo.123456789.js";
    let ret = pkghelper.getEntryFullVersionObj(samplePkgObj, commonPackageArray, webpackModuleArray, "");

    testHelper.assert(obj, ret);
}

function test_getFullVersionObj() {
    let obj = get_getFullVersionObj;
    let webpackModuleArray = ["react", "react-dom", "toolkit"];
    let hash = "abcdefghijklmn";
    let ret = pkghelper.getFullVersionObj(samplePkgObj, webpackModuleArray, hash);

    testHelper.assert(obj, ret);
}

function test_getFullVersion() {
    let obj = get_getFullVersionObj;
    let ret = pkghelper.getFullVersion(samplePkgObj);

    testHelper.assert(obj, ret);
}



