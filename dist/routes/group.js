import express from 'express';
import { createGroup, getGroups, joinGroup, leaveGroup, renameGroup } from '../controllers/group.js';
import { protect } from '../middleware/auth.js';
const groupRoute = express.Router();
groupRoute.route("/").post(protect, createGroup).get(getGroups);
groupRoute.put("/:id", protect, renameGroup);
groupRoute.get("/:id", protect, leaveGroup);
groupRoute.put("/:id/add", protect, joinGroup);
export default groupRoute;
//# sourceMappingURL=group.js.map