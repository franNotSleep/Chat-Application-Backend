import ErrorResponse from '../utils/errorResponse.js';
const errorHandler = (err, req, res, next) => {
    var _a;
    let error = Object.assign({}, err);
    error.message = err.message;
    // Log in the console for dev
    if (process.env.NODE_ENV === "development") {
        console.log(err);
    }
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        error = new ErrorResponse(`Resource Not Found.`, 404);
    }
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        if (typeof err.errors === "object") {
            const errMsg = Object.values(err.errors).map((val) => val.message);
            error = new ErrorResponse(errMsg, 400);
        }
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        error = new ErrorResponse("Duplicate field", 400);
    }
    res
        .status((_a = error.statusCode) !== null && _a !== void 0 ? _a : 500)
        .json({ success: false, error: error.message || "Server Error" });
};
export default errorHandler;
//# sourceMappingURL=errorHandler.js.map