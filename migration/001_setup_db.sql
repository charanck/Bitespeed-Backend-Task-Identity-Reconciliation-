CREATE TABLE contacts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phoneNumber VARCHAR(20),
    email TEXT,
    linkedId INTEGER,
    linkPrecedence TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deletedAt TEXT,
    FOREIGN KEY(linkedId) REFERENCES contacts(id)
);