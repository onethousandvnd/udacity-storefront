CREATE TABLE Product (
   id SERIAL PRIMARY KEY,
   name VARCHAR (50) NOT NULL,
   price INT NOT NULL
);

CREATE TABLE UserShopping (
   id SERIAL PRIMARY KEY,
   firstname VARCHAR (50) NOT NULL,
   lastname VARCHAR (50) NOT NULL,
   username VARCHAR (50) NOT NULL,
   password VARCHAR (1000) NOT NULL
);

CREATE TABLE Orders (
   id SERIAL PRIMARY KEY,
   userid INT NOT NULL REFERENCES UserShopping (id),
   status VARCHAR (20) NOT NULL
);

CREATE TABLE OrderItems (
   id SERIAL PRIMARY KEY,
   ordersid INT NOT NULL REFERENCES Orders (id),
   productid INT NOT NULL REFERENCES Product (id),
   quantity INT NOT NULL
);