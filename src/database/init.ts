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
		CREATE TABLE trips (
			trip_id          INT PRIMARY KEY auto_increment,
			name             VARCHAR(100) NOT NULL,
			start_date		 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			end_date         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			difficulty       ENUM('BEGINNER', 'INTERMEDIATE', 'DIFFICULT') NOT NULL,
			type             VARCHAR(100) NOT NULL,
			max_participants INTEGER NOT NULL
		);	
	`);

	console.log("Table created: 'trips'");

	await queryDatabase(`
		CREATE TABLE meetings (	
			date      TIMESTAMP NOT NULL,
			location  VARCHAR(100) NOT NULL,
			purpose   VARCHAR(250) NOT NULL,
			organizer INT NOT NULL REFERENCES members(member_id),
			trip_id	  INT,
			PRIMARY KEY(date, organizer),
			FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
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

	await queryDatabase(`
		CREATE TABLE gear_deposits(
			name VARCHAR(50),
			category ENUM('climbing/mountaineering', 'snowsports', 'other'),
			deposit INTEGER NOT NULL,
			PRIMARY KEY (name)
		);
		
	`);

	console.log("Table created: 'gear_deposits'");	

	await queryDatabase(`
		CREATE TABLE equipment (
			name VARCHAR(50) UNIQUE REFERENCES gear_deposits ON DELETE CASCADE,
			piece_num INTEGER UNIQUE,
			description VARCHAR(300),
			price INTEGER,
			equip_condition VARCHAR(300),
			needs_repairs BOOLEAN,
			PRIMARY KEY (name, piece_num)
		);
	`);

	console.log("Table created: 'equipment'");	

	await queryDatabase(`
		CREATE TABLE quartermaster(
			member_id INT REFERENCES member ON DELETE CASCADE,
			since TIMESTAMP NOT NULL,
			PRIMARY KEY (member_id)
		);		
	`);

	console.log("Table created: 'quartermaster'");
			
	await queryDatabase(`
		CREATE TABLE gear_hours(
			member_id INT NOT NULL REFERENCES quartermaster ON DELETE CASCADE,
			weekday ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
			start_time TIME,
			end_time TIME,
			PRIMARY KEY (weekday, start_time),
			UNIQUE (weekday, end_time)
			);
		
	`);

	console.log("Table created: 'gear_hours'");

	await queryDatabase(`
		CREATE TABLE trip_leader(
			member_id INT REFERENCES member ON DELETE CASCADE,
			num_trips_organized INT NOT NULL,
			PRIMARY KEY (member_id)
		);
	`);

	console.log("Table created: 'trip_leader'");

	await queryDatabase(`
		CREATE TABLE executive(
			member_id INT REFERENCES member ON DELETE CASCADE,
			title VARCHAR(20) REFERENCES exec_descriptions ON DELETE CASCADE,
			start_date DATE NOT NULL,
			end_date DATE,
			PRIMARY KEY (member_id, title),
			UNIQUE (member_id, start_date),
			UNIQUE (member_id, end_date),
			UNIQUE (title, start_date),
			UNIQUE (title, end_date)
		);
	`);

	console.log("Table created: 'executive'");
	
	await queryDatabase(`
		CREATE TABLE exec_description(
			title VARCHAR(20),
			description VARCHAR(300),
			PRIMARY KEY (title),
			UNIQUE (description)
		);
	`);

	console.log("Table created: 'exec_desription'");

	await queryDatabase(`
		CREATE TABLE rents(
			member_id INT REFERENCES member ON DELETE CASCADE,
			ename VARCHAR(50),
			piece_num INT,
			rent_date Date,
			return_date Date,
			PRIMARY KEY (member_id, ename, piece_num),
			UNIQUE (ename, piece_num, rent_date),
			UNIQUE (ename, piece_num, return_date),
			FOREIGN KEY (ename, piece_num) REFERENCES equipment(name, piece_num) ON DELETE CASCADE
		);
		`);

	console.log("Table created: 'rents'");

	await queryDatabase(`
		CREATE TABLE approves_equip_rental(
			renter_id INT,
			ename VARCHAR(50),
			piece_num INT,
			quartermaster_id INT NOT NULL,
			PRIMARY KEY (renter_id, ename, piece_num),
			FOREIGN KEY (quartermaster_id) REFERENCES quartermaster(member_id) ON DELETE CASCADE ON UPDATE CASCADE,
			FOREIGN KEY (renter_id, ename, piece_num) REFERENCES rents(member_id, ename, piece_num)
				ON DELETE CASCADE ON UPDATE CASCADE
		);
	`);

	console.log("Table created: 'approves_equip_rental'");

	await queryDatabase(`
		CREATE TABLE location (
			location_id INT PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			elevation INTEGER NOT NULL,
			is_provincial_park BOOLEAN NOT NULL,
			is_national_park BOOLEAN NOT NULL,
			has_cabin BOOLEAN NOT NULL
		);
	`);

	console.log("Table created: 'location'");
	
	await queryDatabase(`
		CREATE TABLE visits_location (
			trip_id INT  NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
			location_id INT NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE,
			distance INTEGER,
			PRIMARY KEY(trip_id, location_id)
		);
	
	`);

	console.log("Table created: 'visits_location'");

	await queryDatabase(`
		CREATE TABLE trip_report (
			report_id INT PRIMARY KEY,
			title VARCHAR(100) NOT NULL,
			content VARCHAR(5000) NOT NULL,
			published_at TIMESTAMP NOT NULL
		);
		
	`);

	console.log("Table created: 'trip_report'");	

	await queryDatabase(`
		CREATE TABLE emergency_contact (
			name			VARCHAR(50),
			member_id 		INT REFERENCES member ON DELETE CASCADE,
			phone_num  		INTEGER NOT NULL UNIQUE,
			relationship 	VARCHAR(36),
			PRIMARY KEY (member_id, name)
		);
	
	`);

	console.log("Table created: 'emergency_contact'");	

	await queryDatabase(`
		CREATE TABLE pays_membership (
			start_date	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			member_id	INT REFERENCES member ON DELETE CASCADE,
			price		INTEGER,
			end_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (member_id, start_date)
		);
	`);

	console.log("Table created: 'pays_membership'");	

	await queryDatabase(`
		CREATE TABLE writes_report (
			member_id INT REFERENCES member ON DELETE CASCADE,
			report_id INT REFERENCES trip_report ON DELETE CASCADE,
			trip_id  INT REFERENCES trips ON DELETE CASCADE,
			PRIMARY KEY (member_id, report_id, trip_id)
		);	
	`);

	console.log("Table created: 'writes_report'");	
}