import { MySqlDB } from "./MySql";
import { UserContact } from "../app/models/user";
import { OkPacket } from "mysql2";


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

            const [insertResult] = await this.connection.query<OkPacket>(query, values);
            console.log('Entry added successfully');

            return insertResult.insertId;
        } catch (error) {
            console.error('Error adding entry:', error);
        } finally {
            this.closeConnection();
        }
    }
    async getEntry(user: UserContact, inputQuery?: string,) {
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
    async getAllLinkedContacts(email?: string, phoneNumber?: string): Promise<UserContact[] | undefined> {
        try {
            await this.connectToServer();
            this.connection = this.getConnection();

            const query = `SELECT * FROM ${this.tableName} WHERE phoneNumber = ? OR email = ?`;
            const [rows] = await this.connection.query<UserContact[]>(query, [phoneNumber, email]);
            return rows as unknown as UserContact[];
        } catch (error) {
            console.error('Error adding entry:', error);
        } finally {
            this.closeConnection();
        }

    }
    async updateContact(userContact: UserContact) {
        try {
            await this.connectToServer();
            this.connection = this.getConnection();

            const updateQuery = `UPDATE ${this.tableName} SET linkedId = ?, linkPrecedence = ? WHERE id = ?`;

            const [insertResult] = await this.connection.execute(updateQuery, [userContact.linkedId, userContact.linkPrecedence, userContact.id]);
            console.log('Entry updated successfully');
        } catch (error) {
            console.error('Error adding entry:', error);
        } finally {
            this.closeConnection();
        }
    }
}

async function xyz() {
    const contactTable = new ContactTable();
    await contactTable.createTable();
    const userContact = {
        "phoneNumber": "919191",
        "email": "george@hillvalley.edu",
        "linkedId": null,
        "linkPrecedence": "primary",
        "createdAt": new Date()
    } as unknown as UserContact;
    // await contactTable.addEntry(userContact);
    await contactTable.getEntry(userContact);
}
xyz().catch((error) => {
    console.error('An error occurred while creating table:', error);
});
export const contactTable = new ContactTable();
