import { ContactDao } from "../dao/contact.dao";
import { ContactEntity } from "../dao/entity/contact.entity";
import { TContact } from "../dao/entity/types/contact.type";

export class ContactService{
    constructor(private contactDao:ContactDao){}

    async createContact(contactObj:TContact){
        const contactEntity:ContactEntity = new ContactEntity({...contactObj,linkPrecedence:"primary"});
        return this.contactDao.createContact(contactEntity);
    }
}