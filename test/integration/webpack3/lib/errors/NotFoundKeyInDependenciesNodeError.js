class NotFoundKeyInDependenciesNodeError extends Error {
    constructor(key) {
        let message = `the key: ${key} could not be found in dependencies node, you should add ${key} and it's semver in dependencies node`;
        super(message);
        this.name = "NotFoundKeyInDependenciesNodeError";
    }
}

module.exports = NotFoundKeyInDependenciesNodeError;