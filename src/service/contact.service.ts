import { ContactDao } from "src/dao/contact.dao";
import { ContactEntity } from "src/dao/entity/contact.entity";
import { TContact } from "src/dao/entity/types/contact.type";

export class ContactService{
    constructor(private contactDao:ContactDao){}

    async createContact(contactObj:TContact){
        const contactEntity:ContactEntity = new ContactEntity({...contactObj,linkPrecedence:"primary"});
        return this.contactDao.createContact(contactEntity);
    }
}