import { Request, Response } from "express";
import { ContactService } from "../service/contact.service";

export class ContactController{
    constructor(private contactService:ContactService){}

    async createContact(request:Request,response:Response){
        const res = await this.contactService.createContact(request.body);
        console.log(res);
        return response.json(res);
    }
}