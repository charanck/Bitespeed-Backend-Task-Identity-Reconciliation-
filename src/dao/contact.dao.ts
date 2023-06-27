import { ContactEntity } from "./entity/contact.entity";
import { TContact } from "./entity/types/contact.type";

export class ContactDao {
	constructor(private dbConnection: any) {}

	createContact(contact: ContactEntity): Promise<ContactEntity> {
		return new Promise((resolve, reject) => {
			const query = `INSERT INTO contacts(phoneNumber,email,linkedId,linkPrecedence,createdAt,updatedAt) values(?,?,?,?,?,?)`;
			const queryValues = [
				contact.phoneNumber,
				contact.email,
				contact.linkedId,
				contact.linkPrecedence,
				contact.createdAt,
				contact.updatedAt,
			];
			this.dbConnection.run(query, queryValues, (err: any) => {
				if (err) reject(err);
				this.dbConnection.all(
					"SELECT * FROM contacts as c ORDER BY c.createdAt DESC",
					[],
					(err: any, rows: any) => {
						if (err) reject(err);
						resolve(new ContactEntity(rows[0]));
					}
				);
			});
		});
	}

	getRelatedContacts(
		email?: string,
		phoneNumber?: string
	): Promise<ContactEntity[]> {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM contacts AS c WHERE email="${email}" OR phoneNumber="${phoneNumber}" ORDER BY c.createdAt ASC`;
			this.dbConnection.all(query, (err: any, rows: any) => {
				if (err) reject(err);
				if (!rows) resolve([]);
				let contactEntities = rows.map(
					(row: TContact) => new ContactEntity(row)
				);
				resolve(contactEntities);
			});
		});
	}

	updateContact(contact: ContactEntity): Promise<void> {
		return new Promise((resolve, reject) => {
			const query =
				"UPDATE contacts SET phoneNumber=?,email=?,linkedId=?,linkPrecedence=?,updatedAt=? WHERE id=?";
			const queryValue: any[] = [
				contact.phoneNumber,
				contact.email,
				contact.linkedId,
				contact.linkPrecedence,
				new Date().getTime(),
				contact.id,
			];
			this.dbConnection.run(query, queryValue, (err: any) => {
				if (err) reject(err);
				resolve();
			});
		});
	}

	getContactsByPrimaryId(id: number): Promise<ContactEntity[]> {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM contacts AS c WHERE c.linkedId = "${id}" ORDER BY c.createdAt ASC`;
			this.dbConnection.all(query, (err: any, rows: any) => {
				if (err) reject(err);
				if (!rows) resolve([]);
				let contactEntities = rows.map(
					(row: TContact) => new ContactEntity(row)
				);
				resolve(contactEntities);
			});
		});
	}

	getContactById(id: number): Promise<ContactEntity> {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM contacts AS c WHERE c.id = "${id}"`;
			this.dbConnection.all(query, (err: any, rows: any) => {
				if (err) reject(err);
				let contactEntities = rows.map(
					(row: TContact) => new ContactEntity(row)
				);
				resolve(contactEntities[0]);
			});
		});
	}
}
