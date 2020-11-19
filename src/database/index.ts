import mysql, { MysqlError } from 'mysql';
import { Request, Response, NextFunction } from 'express';

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "password",
  database: "cpsc_304"
});

let isConnected = false;

export const middleware = (req: Request, res: Response, next: NextFunction) => {
	if (isConnected) {
		return next();
	}

	connection.connect((err: MysqlError) => {
	  if (err) throw err;

	  isConnected = true;
	  console.log('Database connection established\n');
		
	  next();
	});
};

export function queryDatabase(query: string): Promise<any> {
	if (!isConnected) {
		const err = new Error('A database connection must be established before querying');
		return Promise.reject(err);
	}

	return new Promise((resolve, reject) => {
		connection.query(query, (err, results) => {
			if (err) reject(err);
			resolve(results);
		});
	});
}