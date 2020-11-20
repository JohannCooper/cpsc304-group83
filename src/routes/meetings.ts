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
			SELECT *
			FROM   members
			WHERE  member_id IN (
				SELECT m.member_id
				FROM   attends_meeting am, members m
				WHERE  am.member_id = m.member_id
				AND    am.date = '${date}'
				AND    am.organizer = '${organizer}'
				AND    m.member_id IN (
					SELECT m2.member_id
					FROM   members m2, attends_trip at
					WHERE  at.member_id = m2.member_id
					GROUP BY m2.member_id
					HAVING COUNT(*) >= ALL (
						SELECT COUNT(*)
						FROM   members m3, attends_trip at
						WHERE  at.member_id = m3.member_id
						GROUP BY m3.member_id
					)
				)
			);
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
