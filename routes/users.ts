import express from 'express';

import { getUserGroups } from '../controllers/group.js';
import { getUsers } from '../controllers/users.js';
import { protect } from '../middleware/auth.js';

const userRoute = express.Router();

userRoute.get("/", protect, getUsers);
userRoute.get("/group", protect, getUserGroups);

export default userRoute;
