import express from 'express';

import { login, logout, me, register, updateDetails, updatePassword } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/me", protect, me);
authRouter.put("/uptdetails", protect, updateDetails);
authRouter.put("/uptpassword", protect, updatePassword);

export default authRouter;
