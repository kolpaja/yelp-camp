class ExpressError extends Error() {
    constructor(message, statysCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;