import express, { Request, Response, Express } from "express"
import path from "path";
import { ContactController } from "src/controller/contact.controller";
import { ContactDao } from "src/dao/contact.dao";
import { ContactService } from "src/service/contact.service";
const sqlite3 = require('sqlite3')

export async function startServer(port:number):Promise<void>{
    const app = express();

    await initializeDependencies(app);
    
    app.listen(port,()=>{
        console.log(`Listening on port: ${port}`);
    })
}

async function initializeDependencies(app:Express):Promise<void>{
    const dbConnection = await getDbConnection();
    const contactDao:ContactDao = new ContactDao(dbConnection);
    const contactService:ContactService = new ContactService(contactDao);
    const contactController:ContactController = new ContactController(contactService);

    app.post("/identify",async(request:Request,response:Response)=>{
        return await contactController.createContact(request,response);
    });

    app.all("/*",async(request:Request,response:Response)=>{
        return response.status(404).json({
            message:"Invalid route"
        });
    });
}

async function getDbConnection(){
    const dbPath = path.resolve(__dirname,"../../db/db.sqlite");
    const dbConnection = new sqlite3.Database(dbPath, (err:any) => {
        if (err) {
          console.error(err.message);
          throw err;
        }
        console.log('Connected to SQlite database.');
    });
    return dbConnection;
}