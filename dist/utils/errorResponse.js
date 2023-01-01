class ErrorResponse extends Error {
    constructor(message, statusCode) {
        if (typeof message === "object") {
            super(message.join(", "));
        }
        else if (typeof message === "string") {
            super(message);
        }
        else {
            super(message);
        }
        this.statusCode = statusCode;
    }
}
export default ErrorResponse;
//# sourceMappingURL=errorResponse.js.map