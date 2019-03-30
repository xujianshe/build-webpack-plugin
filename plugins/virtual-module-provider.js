'use strict';
const VirtualStats = require('./virtual-stats');

class VirtualModuleProvider {
    constructor(options) {
        this.options = options;
    }

    static populateFilesystem(options) {
        const fs = options.fs;
        const modulePaths = options.modulePaths;
        const contents = options.contents;
        const mapIsAvailable = typeof Map !== 'undefined';
        const statStorageIsMap = mapIsAvailable && fs._statStorage.data instanceof Map;
        const readFileStorageIsMap = mapIsAvailable && fs._readFileStorage.data instanceof Map;

        for (let i = 0; i < modulePaths.length; i++) {
            if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
                if (fs._readFileStorage.data.has(modulePaths[i])) {
                    continue;
                }
            } else if (fs._readFileStorage.data[modulePaths[i]]) { // enhanced-resolve@3.3.0 or lower
                continue;
            }
            const stats = VirtualModuleProvider.createStats(options);
            if (statStorageIsMap) { // enhanced-resolve@3.4.0 or greater
                fs._statStorage.data.set(modulePaths[i], [null, stats]);
            } else { // enhanced-resolve@3.3.0 or lower
                fs._statStorage.data[modulePaths[i]] = [null, stats];
            }
            if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
                fs._readFileStorage.data.set(modulePaths[i], [null, contents]);
            } else { // enhanced-resolve@3.3.0 or lower
                fs._readFileStorage.data[modulePaths[i]] = [null, contents];
            }
        }
    }

    static statsDate(inputDate) {
        if (!inputDate) {
            inputDate = new Date();
        }
        return inputDate.toString();
    }

    static createStats(options) {
        if (!options) {
            options = {};
        }
        if (!options.ctime) {
            options.ctime = VirtualModuleProvider.statsDate();
        }
        if (!options.mtime) {
            options.mtime = VirtualModuleProvider.statsDate();
        }
        if (!options.size) {
            options.size = 0;
        }
        if (!options.size && options.contents) {
            options.size = options.contents.length;
        }
        return new VirtualStats({
            dev: 8675309,
            nlink: 1,
            uid: 501,
            gid: 20,
            rdev: 0,
            blksize: 4096,
            ino: 44700000,
            mode: 33188,
            size: options.size,
            atime: options.mtime,
            mtime: options.mtime,
            ctime: options.ctime,
            birthtime: options.ctime,
        });
    }
}

module.exports = VirtualModuleProvider;
