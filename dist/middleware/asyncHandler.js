// Returns a new function that wraps `fn` in a try/catch block.
const asyncHandler = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export default asyncHandler;
//# sourceMappingURL=asyncHandler.js.map