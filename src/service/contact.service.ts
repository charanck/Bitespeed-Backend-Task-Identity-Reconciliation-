import { ContactDao } from "../dao/contact.dao";
import { ContactEntity } from "../dao/entity/contact.entity";

export class ContactService {
	constructor(private contactDao: ContactDao) {}

	async createContact(contactObj: any) {
		let allrelatedContacts: Record<number, ContactEntity> = {};
		await this._contactDfs(contactObj, allrelatedContacts);

		// Creating a new contact
		const isNewContact = Object.keys(allrelatedContacts).length === 0;
		if (isNewContact) {
			const newContactEntity = new ContactEntity({
				email: contactObj.email,
				phoneNumber: contactObj.phoneNumber,
				linkPrecedence: "primary",
				createdAt: new Date().getTime(),
				updatedAt: new Date().getTime(),
			});
			const newContact: ContactEntity =
				await this.contactDao.createContact(newContactEntity);
				const emails = newContact.email ? [String(newContact.email)] : [];
				const phoneNumbers = newContact.phoneNumber ? [String(newContact.phoneNumber)] : []
			return this._prepareResponse(
				Number(newContact.id),
				emails,
				phoneNumbers,
				[]
			);
		}

		// Reorganizing contact list
		let contactList = this._contactObjToList(allrelatedContacts);
		this._sortContactList(contactList);

		let isExactContactExists = false,
			foundEmail = false,
			foundPhoneNumber = false;
		({ isExactContactExists, foundEmail, foundPhoneNumber } =
			this._findEmailAndPhoneNumber(
				contactList,
				contactObj,
				isExactContactExists,
				foundEmail,
				foundPhoneNumber
			));

		// Both email and phone number already exists in a same contact
		if (
			isExactContactExists ||
			(foundEmail && !contactObj.phoneNumber) ||
			(foundPhoneNumber && !contactObj.email)
		) {
		}
		// Both email and phone number already exists but in different contacts
		else if (foundEmail && foundPhoneNumber) {
			await this._rearrangeContactPrecedence(contactList);
		}
		// Only one contact with email or phone number is found so creating new contact and assigning primary contact as the found one
		else {
			const newContactEntity = new ContactEntity({
				email: contactObj.email,
				phoneNumber: contactObj.phoneNumber,
				linkedId: Number(contactList[0].id),
				linkPrecedence: "secondary",
				createdAt: new Date().getTime(),
				updatedAt: new Date().getTime(),
			});
			const newContact: ContactEntity =
				await this.contactDao.createContact(newContactEntity);
			contactList.push(newContact);
			await this._rearrangeContactPrecedence(contactList);
		}

		// Preparing and returning response
		return this._formatAndReturnResponse(contactList);
	}

	private async _rearrangeContactPrecedence(contactList: ContactEntity[]) {
		contactList[0].linkedId = null;
		contactList[0].linkPrecedence = "primary";
		await this.contactDao.updateContact(contactList[0]);
		for (let i = 1; i < contactList.length; i++) {
			contactList[i].linkPrecedence = "secondary";
			contactList[i].linkedId = contactList[0].id;
			await this.contactDao.updateContact(contactList[i]);
		}
	}

	private _findEmailAndPhoneNumber(
		contactList: ContactEntity[],
		contactObj: any,
		isExactContactExists: boolean,
		foundEmail: boolean,
		foundPhoneNumber: boolean
	) {
		contactList.forEach((contact) => {
			if (
				contact.email === contactObj.email &&
				contact.phoneNumber === contactObj.phoneNumber
			)
				isExactContactExists = true;
			else if (contact.email === contactObj.email) foundEmail = true;
			else if (contact.phoneNumber === contactObj.phoneNumber)
				foundPhoneNumber = true;
		});
		return { isExactContactExists, foundEmail, foundPhoneNumber };
	}

	private _formatAndReturnResponse(contactList: ContactEntity[]) {
		let emails = new Set<string>();
		emails.add(String(contactList[0].email));
		let phoneNumbers = new Set<string>();
		phoneNumbers.add(String(contactList[0].phoneNumber));
		let secondaryContactIds: number[] = [];
		let primaryContatctId: number = Number(contactList[0].id);
		for (let i = 1; i < contactList.length; i++) {
			if (contactList[i].email) emails.add(String(contactList[i].email));
			if (contactList[i].phoneNumber)
				phoneNumbers.add(String(contactList[i].phoneNumber));
			secondaryContactIds.push(Number(contactList[i].id));
		}
		return this._prepareResponse(
			primaryContatctId,
			Array.from(emails),
			Array.from(phoneNumbers),
			secondaryContactIds
		);
	}

	private _sortContactList(contactList: ContactEntity[]) {
		for (let i = 0; i < contactList.length; i++) {
			for (let j = 0; j < i; j++) {
				if (contactList[j].createdAt > contactList[i].createdAt) {
					const tempContact = contactList[j];
					contactList[j] = contactList[i];
					contactList[i] = tempContact;
				}
			}
		}
	}

	private async _contactDfs(
		contactObj: any,
		allrelatedContacts: Record<number, ContactEntity>
	) {
		let contactList: ContactEntity[] = [
			...(await this.contactDao.getRelatedContacts(
				contactObj.email,
				contactObj.phoneNumber
			)),
		];
		while (contactList.length > 0) {
			const index = contactList.length - 1;
			const currentContact = contactList[index];
			allrelatedContacts[Number(contactList[index].id)] =
				contactList[index];
			contactList.pop();
			if (currentContact.linkedId === null) {
				const fetchedContacts: ContactEntity[] =
					await this.contactDao.getContactsByPrimaryId(
						Number(currentContact.id)
					);
				fetchedContacts.forEach((contact) => {
					if (!(Number(contact.id) in allrelatedContacts))
						contactList.push(contact);
				});
			} else {
				const fetchedContacts: ContactEntity[] =
					await this.contactDao.getContactsByPrimaryId(
						Number(currentContact.linkedId)
					);
				fetchedContacts.forEach((contact) => {
					if (!(Number(contact.id) in allrelatedContacts))
						contactList.push(contact);
				});
				const primaryContact: ContactEntity =
					await this.contactDao.getContactById(
						currentContact.linkedId
					);
				if (!(Number(primaryContact.id) in allrelatedContacts)) {
					contactList.push(primaryContact);
				}
			}
		}
	}

	private _prepareResponse(
		primaryContatctId: number,
		emails: string[],
		phoneNumbers: string[],
		secondaryContactIds: number[]
	) {
		return {
			contact: {
				primaryContatctId: primaryContatctId,
				emails: emails,
				phoneNumbers: phoneNumbers,
				secondaryContactIds: secondaryContactIds,
			},
		};
	}

	private _contactObjToList(contactObj: Record<number, ContactEntity>) {
		let contactList: ContactEntity[] = [];
		for (const key in contactObj) {
			contactList.push(contactObj[key]);
		}
		return contactList;
	}
}

/*
const allrelatedContacts: ContactEntity[] =
			await this.contactDao.getRelatedContacts(
				contactObj?.email,
				contactObj.phoneNumber
			);
            console.log(allrelatedContacts);
            
		let isExactContactExists = false,
			foundEmail = false,
			foundPhoneNumber = false;
		allrelatedContacts.forEach((contact) => {
			if (
				contact.email === contactObj.email &&
				contact.phoneNumber === contactObj.phoneNumber
			)
				isExactContactExists = true;
			if (contact.email === contactObj.email) foundEmail = true;
			if (contact.phoneNumber === contactObj.phoneNumber)
				foundPhoneNumber = true;
		});

		if (allrelatedContacts.length === 0) {
			const contactEntity: ContactEntity = new ContactEntity({
				...contactObj,
				linkPrecedence: "primary",
				createdAt: new Date().getTime(),
				updatedAt: new Date().getTime(),
			});
			const newContact: ContactEntity =
				await this.contactDao.createContact(contactEntity);
			const primaryId: number = Number(newContact.id);
			const emails = [String(newContact.email)];
			const phoneNumbers = [String(newContact.phoneNumber)];
			const secondaryContactIds: number[] = [];
			return this._prepareResponse(
				primaryId,
				emails,
				phoneNumbers,
				secondaryContactIds
			);
		} else {
            // if(isExactContactExists){
            //     const currentContact:ContactEntity = allrelatedContacts[0];
            //     const primaryId:number = currentContact.linkedId ? currentContact.linkedId : 
            // }
            if (foundEmail && foundPhoneNumber) {
				let primaryContact: ContactEntity = allrelatedContacts[0];
				primaryContact.linkedId = null;
				primaryContact.linkPrecedence = "primary";
				await this.contactDao.updateContact(primaryContact);

                let emails:string[] = [String(primaryContact.email)];
                let phoneNumbers:string[] = [String(primaryContact.phoneNumber)];
                let secondaryContactIds:number[] = [];
				for (let i = 1; i < allrelatedContacts.length; i++) {
                    console.log("HERE");
					let currentContact: ContactEntity = allrelatedContacts[i];
					currentContact.linkedId = primaryContact.id;
					currentContact.linkPrecedence = "secondary";
				    await this.contactDao.updateContact(currentContact);
                    emails.push(String(currentContact.email));
                    phoneNumbers.push(String(currentContact.phoneNumber));
                    secondaryContactIds.push(Number(currentContact.id));
				}
                return this._prepareResponse(Number(primaryContact.id),emails,phoneNumbers,secondaryContactIds);
			} else {
			}
		}
*/
