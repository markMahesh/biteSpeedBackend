// here we define the API endpoints and their associated controller methods 

import express from 'express';
import { identify } from '../app/controllers/userController';


const router = express.Router();


router.post('/identify', identify);

export default router;
