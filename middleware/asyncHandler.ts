import { NextFunction, Request, Response } from 'express';

// Returns a new function that wraps `fn` in a try/catch block.
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
