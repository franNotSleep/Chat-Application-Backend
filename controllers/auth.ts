import { NextFunction, Request, Response } from 'express';

// @desc Register User
// @route POST /api/v1/auth/register
// @access public
export const register = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ ok: true });
}

