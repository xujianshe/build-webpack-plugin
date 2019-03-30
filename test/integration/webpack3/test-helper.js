const path = require('path');
class testhelper {
    static getManifestName() {
        let packagePath = path.join(process.cwd(), "package.json");
        let packageObj = require(packagePath);
        if (!packageObj) {
            return "";
        }
        return packageObj.name + ".manifest." + packageObj.version + ".json";
    }

    static getPkgFullVersion() {
        let packagePath = path.join(process.cwd(), "package.json");
        let packageObj = require(packagePath);
        if (!packageObj) {
            return "";
        }
        return packageObj.name + "@" + packageObj.version;
    }

    static getFullVersion(libName) {
        let ret = "";
        let packagePath = path.join(process.cwd(), "package.json");
        let packageObj = require(packagePath);
        if (!packageObj) {
            return "";
        }
        if (packageObj.dependencies) {
            if (packageObj.dependencies[libName]) {
                ret = libName + "@" + packageObj.dependencies[libName];
            }
        }
        return ret;
    }
}

module.exports = testhelper;