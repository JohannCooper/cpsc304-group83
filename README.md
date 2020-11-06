# CPSC 304: Group 83

## Installing mySQL Shell on Windows
https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-configuring.html

## Setting up the database
After you have setup and started your mySQL database, connect to it using your root credentials. Next enter the following commands in order to setup the database so it is compatible with the API.

1. `SHOW DATABASES;` (your should not see any databases other than the default ones)
2. `CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';`
3. `CREATE DATABASE cpsc_304;`
4. `GRANT ALL PRIVILEGES ON cpsc_304.* TO 'user'@'localhost';`
5. `SHOW DATABASES;` (cpsc_304 should now be listed)
6. `use cpsc_304;` (connect to the cpsc_304 database)
7. `SHOW TABLES;` (should be empty)

## Installing node.js on Windows
https://www.guru99.com/download-install-node-js.html

## Setting up the API
1. Navigate the project directory in your terminal.
2. Run `npm install` to install all libraries and dependencies.
3. Run `npm run build` to transpile the TypeScript into JavaScript
4. Run `npm start` or `npm run watch` depending on if you want hot-reloading enabled.

## Populating the database
By default no tables will exist in the database. To initialize all the table in the database as specified in `/src/database/init.ts`, make a `POST` request to `http://localhost:3000/v1/database/init`. Once we start populating the database we might have another endpoint to add the example table records.