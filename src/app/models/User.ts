//contains the model files that define the data structures and interact with the database or other data sources

import { RowDataPacket } from "mysql2";

export interface UserContact extends RowDataPacket {
    id?: number;
    phoneNumber?: string;
    email?: string;
    linkedId?: number;
    linkPrecedence: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export const LinkPrecedenceType = {
    secondary: "secondary",
    primary: "primary"
}

export interface identifyInputParams {
    email?: string;
    phoneNumber?: string;
}

export interface identifyResponse {
    contact: {
        primaryContatctId: number;
        emails: string[]; // first element being email of primary contact 
        phoneNumbers: string[]; // first element being phoneNumber of primary contact
        secondaryContactIds: number[]; // Array of all Contact IDs that are "secondary" to the primary contact
    };
}