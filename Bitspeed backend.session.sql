CREATE TABLE contacts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phoneNumber VARCHAR(20),
    email VARCHAR(20),
    linkedId INTEGER,
    linkPrecedence CHAR(1) CHECK(linkPrecedence IN ('P','S')) NOT NULL,
    createdAt VARCHAR(20) NOT NULL,
    updatedAt VARCHAR(20) NOT NULL,
    deletedAt VARCHAR(20),
    FOREIGN KEY(linkedId) REFERENCES contacts(id)
);