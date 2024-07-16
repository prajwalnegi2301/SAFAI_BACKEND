import express from 'express';

import { isUserAuthenticated } from '../middlewares/auth.js';
import { isAuthenticated } from '../middlewares/auth.js'
import { createMessage, getMessages } from '../controllers/contactUs.controllers.js';

const router = express.Router();

router.post('/createMessageContactUs',isUserAuthenticated,createMessage);
router.get('/getMessagesContactUs',isAuthenticated,getMessages);



export default router;