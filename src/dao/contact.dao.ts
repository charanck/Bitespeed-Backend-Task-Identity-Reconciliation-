import { ContactEntity } from "./entity/contact.entity";

export class ContactDao{
    constructor(private dbConnection:any){}

    createContact(contact:ContactEntity):Promise<void>{
        return new Promise((resolve,reject)=>{
            const query = ``;
            this.dbConnection.run(query,(err: any,row: any)=>{
                console.log(row)
                if (err) reject(err);
                resolve(row);
            })
        });
    }
}