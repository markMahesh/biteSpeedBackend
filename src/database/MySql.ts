import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config(); 
export class MySqlDB {
    protected connection: mysql.Connection | undefined = undefined;
    private MySqlConfig: any;

    constructor(){
        this.MySqlConfig = {
            "host": process.env.MYSQL_HOST,
            "port": process.env.MYSQL_PORT,
            "user": process.env.MYSQL_USER,
            "password": process.env.MYSQL_PASS,
            "database": process.env.MYSQL_DATABASE,
        }
        console.log('mysqlconfig:',this.MySqlConfig)
    }

    async connectToServer(): Promise<void> {
        try {
            this.connection = await mysql.createConnection(this.MySqlConfig);
            console.log('Connected to the database SuccessFully');
        } catch (error) {
            console.error('Failed to connect to the database', error);
        }
    };

    async closeConnection(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.end();
                console.log('Database connection closed');
            } catch (error) {
                console.error('Failed to close the database connection:', error);
            }
        }
    }

    getConnection = (): mysql.Connection => {
        if (!this.connection) {
            throw new Error('Database not connected');
        }
        return this.connection;
    };
}

// export const mysqlDB = new MySqlDB();