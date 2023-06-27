CREATE TABLE contacts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phoneNumber VARCHAR(20),
    email TEXT,
    linkedId INTEGER,
    linkPrecedence TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    deletedAt INTEGER,
    FOREIGN KEY(linkedId) REFERENCES contacts(id)
);