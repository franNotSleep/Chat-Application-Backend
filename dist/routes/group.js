import express from 'express';
import { createGroup, getGroups, renameGroup } from '../controllers/group.js';
import { protect } from '../middleware/auth.js';
const groupRoute = express.Router();
groupRoute.route("/").post(protect, createGroup).get(getGroups);
groupRoute.put("/:id", protect, renameGroup);
export default groupRoute;
//# sourceMappingURL=group.js.map