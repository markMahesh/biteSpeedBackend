import mysql, { Connection, FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class MySqlDB {
    protected connection: Connection | undefined = undefined;

    async connectToServer(): Promise<void> {
        try {
            this.connection = await mysql.createConnection({
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: 'mahesh',
                database: 'biteSpeedDB',
            });
            console.log('Connected to the database');
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

    getConnection = (): Connection => {
        if (!this.connection) {
            throw new Error('Database not connected');
        }
        return this.connection;
    };
}

export const mysqlDB = new MySqlDB();