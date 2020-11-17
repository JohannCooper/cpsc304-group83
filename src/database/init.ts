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
	await queryDatabase(`
		CREATE TABLE members (
			member_id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
				date TIMESTAMP NOT NULL,
				location VARCHAR(100) NOT NULL,
				purpose VARCHAR(250) NOT NULL,
				organizer INT NOT NULL REFERENCES members(member_id),
				PRIMARY KEY(date, organizer)
			);
	`);

	console.log("Table created: 'meetings'");
	
	await queryDatabase(`
			CREATE TABLE holds_trip_meeting (	
				trip_id INT NOT NULL REFERENCES trips(trip_id),
				date TIMESTAMP NOT NULL REFERENCES meetings(date),
				organizer INT NOT NULL REFERENCES meetings(organizer),
				PRIMARY KEY(trip_id, date, organizer)
			);
	`);

	console.log("Table created: 'holds_trip_meeting'");
		
	await queryDatabase(`
		CREATE TABLE attends_meeting (	
			member_id INT NOT NULL REFERENCES members(member_id),
			date TIMESTAMP NOT NULL REFERENCES meetings(date),
			organizer INT NOT NULL REFERENCES meetings(organizer),
			PRIMARY KEY(member_id, date, organizer)
			
		);
	`);

	console.log("Table created: 'attends_meeting'");

	await queryDatabase(`
		CREATE TABLE trips (
			trip_id INT PRIMARY KEY AUTO_INCREMENT,	
			name VARCHAR(100) NOT NULL,
			start_date TIMESTAMP NOT NULL,
			end_date TIMESTAMP NOT NULL, 
			difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'DIFFICULT') NOT NULL, 
			type VARCHAR(100) NOT NULL, 
			Max_participants INTEGER NOT NULL
			);	
	`);

	console.log("Table created: 'trips'");


	await queryDatabase(`
			CREATE TABLE leads (
				member_id INT REFERENCES members ON DELETE CASCADE,
				trip_id INT REFERENCES trips ON DELETE CASCADE,
				PRIMARY KEY (member_id, trip_id)
			);
	`);

	console.log("Table created: 'leads'");


	await queryDatabase(`
			CREATE TABLE attends_trip (
				member_id INT REFERENCES members ON DELETE CASCADE,
				trip_id INT REFERENCES trips ON DELETE CASCADE,
				PRIMARY KEY (member_id, trip_id)
			);
	`);

	console.log("Table created: 'attends_trip'");


	await queryDatabase(`
		INSERT INTO trips (trip_id, name, start_date, end_date, difficulty, type, max_participants)
		VALUES 
			( '1', 'Trail maintenance at PSP', '2020-10-22 19:00:00', '2020-10-24 19:00:00', 'BEGINNER', 'WORK HIKE', '20' ),
			( '2', 'Backcountry camping', '2020-12-20 19:00:00', '2020-12-26 19:00:00', 'DIFFICULT', 'CAMPING', '8'),
			( '3', 'Son of the rock', '2021-05-15 19:00:00', '2021-05-16 19:00:00', 'INTERMEDIATE', 'CLIMBING', '50' ),
			( '4', 'Skiing to a hut', '2020-11-20 19:00:00', '2020-11-20 19:00:00', 'INTERMEDIATE', 'CROSS COUNTRY SKIING', '15' ),
			( '5', 'The Chief', '2020-08-11 19:00:00', '2020-08-12 04:00:00', 'BEGINNER', 'HIKING', '10' );
	`);

	console.log("Table populated: 'trips'");

	await queryDatabase(`
		INSERT INTO members (member_id, first_name, full_name, email, phone_num, is_honorary, valid_workhike)
		VALUES
			('1', 'Cassandra', 'Cassandra Elphinstone', 'celph@gmail.com', '5123452456', FALSE, TRUE),
			('2', 'Declan', 'Declan Taylor', 'taylor32@yahoo.com', '6049386735', FALSE, TRUE),
			('3', 'Ross', 'Ross Campbell', 'rcsoup@aol.com', '7189905643', TRUE, FALSE),
			('4', 'Haley', 'Haley Foladare', 'haleyf@gmail.com', '5193627465', FALSE, FALSE),
			('5', 'Leonard', 'Leonard Bernstein', 'lbwss@rodgers.com', '6046584732', TRUE, TRUE);
		
	`);

	console.log("Table populated: 'members'");

	await queryDatabase(`
		INSERT INTO meetings ( date, location, purpose, organizer )
		VALUES
			( '2020-11-07 19:00:00', 'VOC Office', 'First meeting for hut skiing', '2' ),
			( '2020-11-13 19:00:00', 'VOC Office', 'Second meeting for hut skiing', '2' ),
			( '2020-11-17 19:00:00', 'VOC Office', 'Third meeting for hut skiing', '2' ),

			( '2020-08-09 17:00:00', 'Life Building Starbucks', 'Planning out Chief ascent', '3' ),

			( '2021-05-10 18:30:00', 'EOSC 2011', 'Son of Rock Meeting!', '4' ),

			( '2020-09-21 19:00:00', 'Blue Chip', 'Planning our trip to Mount Fromme', '3' ),
			( '2020-10-01 19:00:00', 'Hennings', 'Best trip videos and photos of the past year', '4' ),
			( '2020-02-14 19:00:00', 'The Aviary', 'Teach people climbing terminology', '3' ),
			( '2020-05-03 19:00:00', 'VOC Office', 'How to rent equipment for dummies', '2' );	
	`);

	console.log("Table populated: 'meetings'");

	await queryDatabase(`
		INSERT INTO leads
		VALUES
			('1', '1'),
			('2', '4'),
			('2', '2'),
			('4', '3'),
			('3', '5');
	`);

	console.log("Table populated: 'leads'");

	await queryDatabase(`
		INSERT INTO attends_trip
		VALUES
			('1', '4'),
			('3', '4'),
			('4', '4'),
			('5', '4'),
			('3', '3');
	`);

	console.log("Table populated: 'attends_trip'");

	await queryDatabase(`
		INSERT INTO holds_trip_meeting
		VALUES
			('4', '2020-11-07 19:00:00', '2'),
			('4', '2020-11-13 19:00:00', '2'),
			('4', '2020-11-17 19:00:00', '2'),
			('5', '2020-08-09 17:00:00', '3'),
			('3', '2021-05-10 18:30:00', '4');
	`);

	
	console.log("Table populated: 'holds_trip_meeting'");

	await queryDatabase(`
		INSERT INTO attends_meeting
		VALUES
			('1', '2020-11-07 19:00:00', '2'),
			('3', '2020-11-07 19:00:00', '2'),
			('4', '2020-11-07 19:00:00', '2'),
			('5', '2020-11-07 19:00:00', '2'),

			('1', '2020-11-13 19:00:00', '2'),
			('3', '2020-11-13 19:00:00', '2'),
			('5', '2020-11-13 19:00:00', '2'),

			('1', '2020-11-17 19:00:00', '2'),
			('4', '2020-11-17 19:00:00', '2'),
			('5', '2020-11-17 19:00:00', '2'),

			('3', '2021-05-10 18:30:00', '4');
	`);

	console.log("Table populated: 'attends_meeting'");

	
}