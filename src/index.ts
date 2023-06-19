// entry point file for this backend service. It sets up the server, initializes necessary middleware, and connects the routes

import express, { Request, Response } from 'express';
import userRoutes from '../src/routes/UserRoutes';


const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.use(express.json());

app.use('', userRoutes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// async function main() {
//     await mysqlDB.connectToDatabase();

//     // Perform mysqlDB operations using the connection
//     const connection = mysqlDB.getDatabase();
//     if (connection) {
//         // const query = 'SELECT * FROM users';
//         // const [rows] = await connection.query(query);
//         // console.log(rows);
//         console.log()
//     }

//     // Close the mysqlDB connection when finished
//     await mysqlDB.closeConnection();
// }

// main().catch((error) => {
//     console.error('An error occurred:', error);
// });