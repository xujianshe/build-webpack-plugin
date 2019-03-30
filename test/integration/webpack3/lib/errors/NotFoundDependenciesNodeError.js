class NotFoundDependenciesNodeError extends Error {
    constructor() {
        let message = "the dependencies node could not be found in package.json";
        super(message);
        this.name = "NotFoundDependenciesNodeError";
    }
}

module.exports = NotFoundDependenciesNodeError;