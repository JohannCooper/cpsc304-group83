import { Router, Request, Response } from 'express';
import { queryDatabase } from '../database';

export const router = Router();

router.get('/meeting', async (req: Request, res: Response) => {
	try {
		const results = await queryDatabase(`
			SELECT *
			FROM meeting;
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.post('/meeting', async (req: Request, res: Response) => {
	try {
		const { date, location, purpose, organizer } = req.body;

		await queryDatabase(`
			INSERT INTO meeting (name, description)
			VALUES ('${date}', '${location}', '${purpose}', '${organizer}');
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.put('/meeting/:olddate/:oldlocation', async (req: Request, res: Response) => {
	try {
		const { olddate: olddate, oldlocation: oldlocation } = req.params;
		const { date, location } = req.body;

		// TODO: Why is 'date' a keyword?
		await queryDatabase(`
			UPDATE meeting m
			SET m.date = '${date}', location = '${location}' 
			WHERE m.date = '${olddate}', location = '${oldlocation}';
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.delete('/meeting/:date/:location', async (req: Request, res: Response) => {
	try {
		const { date: date, location: location } = req.params;

		await queryDatabase(`
			DELETE FROM meeting m
			WHERE m.date = '${date}', location = '${location}';
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});