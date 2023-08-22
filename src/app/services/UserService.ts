import { contactTable } from "../../database/contactTable";
import { UserContact, identifyInputParams, identifyResponse, LinkPrecedenceType } from "../models/User";

const Queries = {
    contactHavingMobileAndEmail: ``,
};

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
        // 2 cases
        // 1. Contact Does not Exist
        // 2. Contact Exist
        if (!(input.email || input.phoneNumber)) {
            throw new Error("INVALID INPUT");
        }

        let userContacts: UserContact[] | undefined = await contactTable.getAllLinkedContacts(input.email, input.phoneNumber)
        console.log('userContacts linked: ', userContacts);
        if (userContacts == undefined) userContacts = [];

        if (userContacts && userContacts.length == 0) // create new entry in the table
        {
            const newContact = {
                phoneNumber: input.phoneNumber,
                email: input.email,
                linkPrecedence: LinkPrecedenceType.primary,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as unknown as UserContact;
            const insertId = await contactTable.addEntry(newContact);
            return {
                "contact": {
                    "primaryContatctId": (insertId) ? insertId : -1,
                    "emails": (newContact.email) ? [newContact.email] : [],
                    "phoneNumbers": (newContact.phoneNumber) ? [newContact.phoneNumber] : [],
                    "secondaryContactIds": []
                },
            }
        }
        else {
            let primaryLinkedContactArray: UserContact[] = [];
            let secondaryLinkedContactArray: UserContact[] = [];
            const userContactSet = new Set<UserContact>();
            for (const contact of userContacts) {
                if (contact.linkPrecedence == LinkPrecedenceType.primary) {
                    primaryLinkedContactArray.push(contact);
                }
                else {
                    secondaryLinkedContactArray.push(contact);
                }
                userContactSet.add(contact);
            }
            if (primaryLinkedContactArray.length >= 2) {
                // update the all the rows and make their linkedPrecedence as secondary 
                console.log("update these primary to secondary");

                primaryLinkedContactArray.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                const primaryLinkedId = primaryLinkedContactArray[0].id;
                primaryLinkedContactArray = primaryLinkedContactArray.slice(1);
                for (const ind in primaryLinkedContactArray) {
                    primaryLinkedContactArray[ind].linkPrecedence = LinkPrecedenceType.secondary;
                    primaryLinkedContactArray[ind].linkedId = primaryLinkedId;
                    await contactTable.updateContact(primaryLinkedContactArray[ind]);
                }
            }
            else if (!(isUserContactPresentInDB(input.email, input.phoneNumber, userContacts))) {
                //add the new row in DB against request if new information is there

                console.log("add entry in DB");
                const requsetedUserContact = {
                    phoneNumber: input.phoneNumber,
                    email: input.email,
                    linkedId: userContacts[0].id,
                    linkPrecedence: LinkPrecedenceType.secondary,
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as unknown as UserContact;

                await contactTable.addEntry(requsetedUserContact);
                console.log("Requested User Contact Added");

            }
            //main logic to extract all the connected links
            let primaryLinkedContact: UserContact = {} as unknown as UserContact;
            let emails = new Set<string>;
            let phoneNumbers = new Set<string>;
            let secondaryContactIds = new Set<Number>
            console.log('set = ', userContactSet);

            while (userContacts.length) {
                console.log("length = ", userContacts.length)
                if (userContacts[0].linkPrecedence == LinkPrecedenceType.primary)
                    primaryLinkedContact = userContacts[0];
                else {
                    if (userContacts[0].email)
                        emails.add(userContacts[0].email);
                    if (userContacts[0].phoneNumber)
                        phoneNumbers.add(userContacts[0].phoneNumber);
                    if (userContacts[0].id)
                        secondaryContactIds.add(userContacts[0].id)
                }
                let newUserContacts: UserContact[] | undefined = await contactTable.getAllLinkedContacts(userContacts[0].email, userContacts[0].phoneNumber)
                console.log('newUserContacts linked: ', newUserContacts);
                if (newUserContacts == undefined) newUserContacts = [];
                for (const newUserContact of newUserContacts) {
                    if (!hasObject(newUserContact, userContactSet)) {
                        console.log('adding this to array', newUserContact);
                        userContactSet.add(newUserContact);
                        userContacts.push(newUserContact);
                    }
                }
                // userContacts = userContacts?.concat(newUserContacts);
                userContacts = userContacts.slice(1);
                console.log('set:----> ', userContactSet);

            }
            if (primaryLinkedContact.email && emails.has(primaryLinkedContact.email))
                emails.delete(primaryLinkedContact.email)
            if (primaryLinkedContact.phoneNumber && phoneNumbers.has(primaryLinkedContact.phoneNumber))
                phoneNumbers.delete(primaryLinkedContact.phoneNumber)
            return {
                "contact": {
                    "primaryContatctId": primaryLinkedContact.id,
                    "emails": [primaryLinkedContact.email].concat([...emails]),
                    "phoneNumbers": [primaryLinkedContact.phoneNumber].concat([...phoneNumbers]),
                    "secondaryContactIds": [...secondaryContactIds]
                },
            } as unknown as identifyResponse;
        }

    }
}

function hasObject(obj: UserContact, set: Set<UserContact>): boolean {
    for (const item of set) {
        if (item.id === obj.id) {
            return true;
        }
    }
    return false;
};

export const userService = new UserService();

function isUserContactPresentInDB(email: string | undefined, phoneNumber: string | undefined, userContacts: UserContact[]) {
    for (const userContact of userContacts) {
        // email is null 
        //          - userContact == null
        //          - userContact = "adsafa@gmail.com"
        // email is "abc@gmail.com"
        //          - userContact == null
        //          - userContact = "adsafa@gmail.com"
        let isEmailMatched: boolean;
        let isPhoneMatched: boolean;
        if (email) {
            isEmailMatched = (userContact.email === email);
        }
        else {
            isEmailMatched = true;
        }
        if (phoneNumber) {
            isPhoneMatched = (userContact.phoneNumber === phoneNumber);
        }
        else {
            isPhoneMatched = true;
        }
        console.log('userContact.email: ', userContact.email, '  matching with email: ', email);
        console.log('userContact.phoneNumber: ', userContact.phoneNumber, '  matching with phoneNumber: ', phoneNumber);

        console.log(isEmailMatched, '<-email || phone ->', isPhoneMatched)
        if (isPhoneMatched && isEmailMatched)
            return true;
    }
    return false;
}

