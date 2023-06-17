import { MySqlDB } from "./MySql";
import { UserContact } from "../app/models/user";


export class ContactTable extends MySqlDB {
    protected tableName = 'Contacts';
    async createTable() {
        try {
            await this.connectToServer();
            this.connection = this.getConnection()
            const query = `
                        CREATE TABLE IF NOT EXISTS ${this.tableName}(
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            phoneNumber VARCHAR(255),
                            email VARCHAR(255),
                            linkedId INT,
                            linkPrecedence ENUM('secondary', 'primary'),
                            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            deletedAt TIMESTAMP
                        )`;

            // Execute the query
            await this.connection.query(query);
            console.log('Table created successfully');
        } catch (error) {
            console.error('Error creating table:', error);
        } finally {
            this.closeConnection();
        }
    }
    async addEntry(userContact: UserContact) {
        try {
            await this.connectToServer();
            this.connection = this.getConnection();

            const query = `INSERT INTO ${this.tableName} (email,phoneNumber,linkedId,linkPrecedence,createdAt) VALUES (?, ?, ?, ?, ?)`;
            const values = [userContact.email, userContact.phoneNumber, userContact.linkedId, userContact.linkPrecedence, userContact.createdAt];

            await this.connection.query(query, values);
            console.log('Entry added successfully');

        } catch (error) {
            console.error('Error adding entry:', error);
        } finally {
            this.closeConnection();
        }
    }
    async getEntry(user: UserContact, query?: string,) {
        try {
            await this.connectToServer();
            this.connection = this.getConnection();

            const query = `SELECT * FROM ${this.tableName}`;

            const [rows] = await this.connection.query<UserContact[]>(query);
            for (const row of rows) {
                console.log(row);
            }
            return rows;
        } catch (error) {
            console.error('Error retrieving entries:', error);
            return [];
        } finally {
            this.closeConnection();
        }
    }
}

async function main() {
    const contactTable = new ContactTable();
    await contactTable.createTable();
    const userContact = {
        "phoneNumber": "919191",
        "email": "george@hillvalley.edu",
        "linkedId": null,
        "linkPrecedence": "primary",
        "createdAt": new Date()
    } as unknown as UserContact;
    await contactTable.addEntry(userContact);
    await contactTable.getEntry(userContact);
}

main().catch((error) => {
    console.error('An error occurred while creating table:', error);
});

