import { Router, Request, Response } from 'express';
import { queryDatabase } from '../database';

export const router = Router();

//SELECTION: select trips in given date range sd - ed

router.get('/tripsinrange', async (req: Request, res: Response) => {
	try {
		const { sd, ed } = req.body;

		const results = await queryDatabase(`
            SELECT *
            FROM trips
            WHERE start_date <= TIMESTAMP('${sd}') AND end_date >= TIMESTAMP('${ed}');
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

//PROJECTION: project full name, phone number, email for every member going on a trip

router.get('/', async (req: Request, res: Response) => {
	try {
		const { tid } = req.query;

		const results = await queryDatabase(`
			SELECT m.full_name, m.email, m.phone_num
			FROM members m, trips t, attends_trip at
			WHERE t.trip_id = '${tid}' AND t.trip_id = at.trip_id AND m.member_id = at.member_id;
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});