import { Router, Request, Response } from 'express';
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