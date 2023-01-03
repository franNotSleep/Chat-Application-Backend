import express from 'express';

import { createMessage, deleteMessage, getMessages } from '../controllers/message.js';
import { protect } from '../middleware/auth.js';

const messageRoute = express.Router();

messageRoute
  .route("/:groupId/message")
  .post(protect, createMessage)
  .get(getMessages);
messageRoute.route("/:id").delete(protect, deleteMessage);

export default messageRoute;
