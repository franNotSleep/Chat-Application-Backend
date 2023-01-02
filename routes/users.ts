import express from 'express';

import { getUsers } from '../controllers/users.js';
import { protect } from '../middleware/auth.js';

const userRoute = express.Router();

userRoute.get("/", protect, getUsers);

export default userRoute;
