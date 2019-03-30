class msghelper {

    static getLibraryNotFoundWarning() {
        return "(seicmic-build-webpack-plugin) Warning：The 'library' node is empty in the 'output' config, it is recommended to configure the name of your repo";
    }
}
module.exports = msghelper;