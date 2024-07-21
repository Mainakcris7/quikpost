class ShareNetError extends Error {
    constructor(code, msg) {
        super(msg)
        this.code = code;
        this.message = msg
    }
}
module.exports = ShareNetError;