class InvalidPluginParameterError extends Error {
    constructor() {
        let message = `Invalid parameter! The plugin requires a json object, and the json object contains two key-values like as below:
            1.'commonPackages' that it is an string array type stores the common libraries need to be external ;
            2.'seismicPackages' that it is an string array type stores the seismic libraries need to be external;
            the example :{ commonPackages: ['react','react-dom'], seismicPackages: ['seismic-toolkit'] }`;
        super(message);
        this.name = "InvalidPluginParameterError";
    }
}
module.exports = InvalidPluginParameterError;