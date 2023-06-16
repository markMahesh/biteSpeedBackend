// entry point file for this backend service. It sets up the server, initializes necessary middleware, and connects the routes

import express, { Request, Response } from 'express';
import userRoutes from '../src/routes/UserRoutes';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.use(express.json());

app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
