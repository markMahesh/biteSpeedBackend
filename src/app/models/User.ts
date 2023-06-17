//contains the model files that define the data structures and interact with the database or other data sources

import { RowDataPacket } from "mysql2";

// export interface User {
//     id: string;
//     name: string;
//     email: string;
//     // Other user properties
// }
export interface UserContact extends RowDataPacket {
    id: number;
    phoneNumber?: String;
    email?: String;
    linkedId?: number;
    linkPrecedence: linkPrecedenceType;
    createdAt: number;
    updatedAt: number;
    deletedAt?: number;
}
export interface linkPrecedenceType {
    secondary: "secondary";
    primary: "primary";
}

// Methods to interact with the database or other data source
// export const User = {
//     findById: (id: string) => {
//         // Logic to fetch user by ID
//         // Returns a User object
//     },
//     create: (userData: Partial<UserContact>) => {
//         // Logic to create a new user
//         // Returns the newly created User object
//     },
//     // Add more methods for other CRUD operations
// };
