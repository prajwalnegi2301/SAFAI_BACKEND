import express from 'express';
import {  isUserAuthenticated } from '../middlewares/auth.js';

import { createFeedback, getFeedbacks} from '../controllers/feedback.controllers.js';

const router = express.Router();



router.post('/createFeedback/:id',isUserAuthenticated,createFeedback);
router.get('/getFeedbacks/:id',getFeedbacks);

export default router;
