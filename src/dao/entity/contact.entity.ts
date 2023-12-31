import { TContact } from "./types/contact.type";

export class ContactEntity {
	public id: number | null;
	public phoneNumber: string | null;
	public email: string | null;
	public linkedId: number | null;
	public linkPrecedence: string;
	public createdAt: number;
	public updatedAt: number;
	public deletedAt: number | null;

	constructor(options: TContact) {
        this.validate(options);
		this.id = options.id ? options.id : null;
		this.phoneNumber = options.phoneNumber ? options.phoneNumber : null;
		this.email = options.email ? options.email : null;
		this.linkedId = options.linkedId ? options.linkedId : null;
		this.linkPrecedence = options.linkPrecedence;
		this.createdAt = options.createdAt;
		this.deletedAt = options.deletedAt ? options.deletedAt : null;
		this.updatedAt = options.updatedAt;
	}

	validate(options: TContact) {
        const isValidLinkPrecedence: Boolean = ["primary","secondary"].includes(options.linkPrecedence);
        if(!isValidLinkPrecedence) throw new Error("Link precedence must be 'primary' or 'secondary'");
    }

    getObj():Object{
        return {...this};
    }
}