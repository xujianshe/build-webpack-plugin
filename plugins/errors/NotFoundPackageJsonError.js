class NotFoundPackageJsonError extends Error {
    constructor(path) {
        let message = `the package.json file not be found : ${path} `;
        super(message);
        this.name = "NotFoundPackageJsonError";
    }
}

module.exports = NotFoundPackageJsonError;