class ParamDuplicationError extends Error {
    constructor(param) {
        let message = `Parameter duplication : ${param} `;
        super(message);
        this.name = "ParamDuplicationError";
    }
}

module.exports = ParamDuplicationError;