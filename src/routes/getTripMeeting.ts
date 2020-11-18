import { Router, Request, Response } from 'express';
import { queryDatabase } from '../database';

export const router = Router();

router.get('/tripmeeting/:tripID', async (req: Request, res: Response) => {
	try {
		const { tripID: id } = req.params;

		const results = await queryDatabase(`
			SELECT m.date, m.location, m.purpose
			FROM holds_trip_meeting htm, meeting m
			WHERE htm.trip_id = id AND htm.date = m.date AND htm.organizer = m.organizer;
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});