import { Router, Request, Response } from 'express';
import { queryDatabase } from '../database';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
	try {
		const results = await queryDatabase(`
			SELECT *
			FROM trips;
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.get('/:tripId/meeting', async (req: Request, res: Response) => {
	try {
		const { tripId: id } = req.params;

		const results = await queryDatabase(`
			SELECT m.date, 
						 m.location,
						 m.purpose
			FROM   holds_trip_meeting htm, meetings m
			WHERE  htm.trip_id = '${id}' 
			AND    htm.date = m.date 
			AND    htm.organizer = m.organizer;
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});


router.get('/attendance', async (req: Request, res: Response) => {
	try {
		const { count } = req.query;

    const results = await queryDatabase(`
      SELECT *
      FROM trips
      WHERE trip_id IN (
        SELECT trip_id
        FROM attends_trip
        GROUP BY trip_id
        HAVING COUNT(*) >= ${count}
      );
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.get('/thisWeek', async (req: Request, res: Response) => {
	try {
    const results = await queryDatabase(`
	  SELECT SUM(Temp.count) as count
	  FROM (SELECT COUNT(*) AS count
      		FROM   trips
      		GROUP BY start_date
      		HAVING   start_date >= '2020-11-23' AND start_date <= '2020-11-29') as Temp;
      `);

    res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

//SELECTION: select trips in given date range sd - ed

router.get('/filter', async (req: Request, res: Response) => {
	try {
		const { sd, ed } = req.query;

		const results = await queryDatabase(`
            SELECT *
            FROM trips
            WHERE start_date >= '${sd}' AND end_date <= '${ed}';
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

//PROJECTION: project full name, phone number, email for every member going on a trip

router.get('/participants', async (req: Request, res: Response) => {
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


router.delete('/:tripId', async (req: Request, res: Response) => {
	try {
		const { tripId } = req.params;

		await queryDatabase(`
			DELETE FROM trips
			WHERE trip_id = '${tripId}';
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});
