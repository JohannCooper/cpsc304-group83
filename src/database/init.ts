import { queryDatabase } from '.';

export async function createTables() {
	await queryDatabase(`
		CREATE TABLE example (
			id INT NOT NULL AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL,
			description VARCHAR(100) NOT NULL,
			PRIMARY KEY ( id )
		);
	`);
	console.log("Table created: 'example'");

	await queryDatabase(`
		CREATE TABLE members (
			member_id      INT NOT NULL auto_increment PRIMARY KEY,
			first_name     VARCHAR(20),
			full_name      VARCHAR(50),
			email          VARCHAR(50) UNIQUE,
			phone_num      VARCHAR(10) UNIQUE,
			is_honorary    BOOLEAN,
			valid_workhike BOOLEAN
		);  
	`);

	console.log("Table created: 'members'");

	await queryDatabase(`
		CREATE TABLE meetings (	
			date      TIMESTAMP NOT NULL,
			location  VARCHAR(100) NOT NULL,
			purpose   VARCHAR(250) NOT NULL,
			organizer INT NOT NULL REFERENCES members(member_id),
			PRIMARY KEY(date, organizer)
		);
	`);

	console.log("Table created: 'meetings'");
	
	await queryDatabase(`
		CREATE TABLE holds_trip_meeting (	
			trip_id   INT NOT NULL REFERENCES trips(trip_id),
			date      TIMESTAMP NOT NULL REFERENCES meetings(date),
			organizer INT NOT NULL REFERENCES meetings(organizer),
			PRIMARY KEY(trip_id, date, organizer)
		);
	`);

	console.log("Table created: 'holds_trip_meeting'");
		
	await queryDatabase(`
		CREATE TABLE attends_meeting (	
			member_id INT NOT NULL REFERENCES members(member_id),
			date      TIMESTAMP NOT NULL REFERENCES meetings(date),
			organizer INT NOT NULL REFERENCES meetings(organizer),
			PRIMARY KEY(member_id, date, organizer)
		);
	`);

	console.log("Table created: 'attends_meeting'");

	await queryDatabase(`
		CREATE TABLE trips (
			trip_id          INT PRIMARY KEY auto_increment,
			name             VARCHAR(100) NOT NULL,
			start_date		 	 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			end_date         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			difficulty       ENUM('BEGINNER', 'INTERMEDIATE', 'DIFFICULT') NOT NULL,
			type             VARCHAR(100) NOT NULL,
			max_participants INTEGER NOT NULL
		);	
	`);

	console.log("Table created: 'trips'");


	await queryDatabase(`
		CREATE TABLE leads (
			member_id INT REFERENCES members ON DELETE CASCADE,
			trip_id   INT REFERENCES trips ON DELETE CASCADE,
			PRIMARY KEY (member_id, trip_id)
		);
	`);

	console.log("Table created: 'leads'");


	await queryDatabase(`
		CREATE TABLE attends_trip (
			member_id INT REFERENCES members ON DELETE CASCADE,
			trip_id   INT REFERENCES trips ON DELETE CASCADE,
			PRIMARY KEY (member_id, trip_id)
		);
	`);

	console.log("Table created: 'attends_trip'");	
}