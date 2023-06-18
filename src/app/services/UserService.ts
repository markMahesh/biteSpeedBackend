import { contactTable } from "../../database/contactTable";
import { UserContact, identifyInputParams, identifyResponse, LinkPrecedenceType } from "../models/user";

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
            };
            const insertId = await contactTable.addEntry(newContact as unknown as UserContact);
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
            //main logic to extract all the connected links
            let primaryLinkedContact: UserContact = {} as unknown as UserContact;
            let emails = new Set<string>;
            let phoneNumbers = new Set<string>;
            let secondaryContactIds = new Set<Number>
            let index = 0;
            console.log('set = ', userContactSet);

            while (index < userContacts.length) {
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
                index++;
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

function getAllLinkedContacts(email: string | undefined, phoneNumber: string | undefined): UserContact[] | PromiseLike<UserContact[]> {
    throw new Error("Function not implemented.");
}
