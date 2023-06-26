import { TContact } from "./types/contact.type";

export class ContactEntity {
	private id: number | null;
	private phoneNumber: string | null;
	private email: string | null;
	private linkedId: number | null;
	private linkPrecedence: string;
	private createdAt: Date;
	private updatedAt: Date;
	private deletedAt: Date;

	constructor(options: TContact) {
        this.validate(options);
		this.id = options.id ? options.id : null;
		this.phoneNumber = options.phoneNumber ? options.phoneNumber : null;
		this.email = options.email ? options.email : null;
		this.linkedId = options.linkedId ? options.linkedId : null;
		this.linkPrecedence = options.linkPrecedence;
		this.createdAt = options.createdAt;
		this.deletedAt = options.deletedAt;
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