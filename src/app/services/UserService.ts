class UserService {
    async createContact(mobile?: string, email?: string): Promise<any> {
        if (!(mobile || email))
            throw new Error("INVALID INPUT");
        //business logic 
        return {};
    }
    async identify(input: identifyInputParams): Promise<identifyResponse> {
        // business logic
        // await this.createContact(input?.phoneNumber, input?.email)
        return {
            "contact": {
                "primaryContatctId": 11,
                "emails": ["george@hillvalley.edu", "biffsucks@hillvalley.edu"],
                "phoneNumbers": ["919191", "717171"],
                "secondaryContactIds": [27]
            },
        } as identifyResponse;
    }
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

export const userService = new UserService();