// entry point file for this backend service. It sets up the server, initializes necessary middleware, and connects the routes

import express, { Request, Response } from 'express';
import userRoutes from './routes/UserRoutes';


const app = express();
const port = 3010;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.use(express.json());

app.use('', userRoutes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});