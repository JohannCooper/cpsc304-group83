import { Router, Request, Response } from 'express';
import moment from 'moment-timezone';
import { queryDatabase } from '../database';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
	try {
		const results = await queryDatabase(`
			SELECT *
			FROM meetings;
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

//DIVISION: Get members who went to every meeting

router.get('/loyal', async (req: Request, res: Response) => {
	try {
		const results = await queryDatabase(`
            SELECT m.full_name
            FROM members m 
            WHERE NOT EXISTS 
                 (SELECT *
                 FROM meetings tm
                 WHERE NOT EXISTS (SELECT *
                        FROM attends_meeting am
                        WHERE am.member_id = m.member_id AND tm.date = am.date AND tm.organizer = am.organizer));
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.get('/:date/:organizer/mostExperienced', async (req: Request, res: Response) => {
	try {
		let { date, organizer } = req.params;
		date = moment(date).format('YYYY-MM-DD HH:mm:ss');

		const results = await queryDatabase(`
			SELECT Temp.full_name, Temp.tripCount
			FROM (SELECT m.full_name, COUNT(*) as tripCount
				  FROM members m, attends_trip at1
				  WHERE m.member_id = at1.member_id
				  AND   m.member_id IN (SELECT am.member_id
				  						FROM attends_meeting am
				  						WHERE am.date = '${date}'
				  						AND   am.organizer = '${organizer}')
				  GROUP BY m.full_name) AS Temp
			WHERE Temp.tripCount = (SELECT MAX(Temp.tripCount) from Temp);
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.put('/:oldDate/:oldLocation', async (req: Request, res: Response) => {
	try {
		let { oldDate, oldLocation } = req.params;
		let { date, location } = req.body;

		oldDate = moment(oldDate).format('YYYY-MM-DD HH:mm:ss');
		date = moment(date).format('YYYY-MM-DD HH:mm:ss');

		await queryDatabase(`
			UPDATE meetings m
			SET    location = '${location}',
						 date = '${date}' 
			WHERE  m.date = '${oldDate}'
			AND    location = '${oldLocation}';
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});
