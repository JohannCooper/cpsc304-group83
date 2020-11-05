import { queryDatabase } from '.';

export async function initializeDatabase() {
	await queryDatabase(`
		CREATE TABLE example (
			id INT NOT NULL AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL,
			description VARCHAR(100) NOT NULL,
			PRIMARY KEY ( id )
		);
	`);
	console.log("Table created: 'example'");

	// add other table create statements below
}