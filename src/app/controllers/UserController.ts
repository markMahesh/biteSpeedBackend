// this file handles the incomming requests, interact with models and send response

import { Request, Response } from 'express';
import { userService } from '../services/UserService';

// export const getUser = (req: Request, res: Response) => {
//     // Controller method for handling GET /users/:id
//     const userId = req.params.id;
//     // Logic to fetch the user from the database or other data source
//     const user = User.findById(userId);
//     res.json(user);
// };

export const identify = async (req: Request, res: Response) => {
    // Controller method for handling POST /identify
    const userData = req.body;
    console.log("userData Identify: ", userData);
    const resp = await userService.identify(userData);
    console.log("resp: ", resp);
    res.status(201).json(resp);
};