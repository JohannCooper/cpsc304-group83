import { Router, Request, Response } from 'express';
import { queryDatabase } from '../database';

export const router = Router();

router.post('/', async (req: Request, res: Response) => {
	try {
		const { first_name, full_name, email, phone_num, is_honorary, valid_workhike } = req.body;

		await queryDatabase(`
			INSERT INTO members (first_name, full_name, email, phone_num, is_honorary, valid_workhike)
			VALUES ('${first_name}', '${full_name}', '${email}', '${phone_num}', ${is_honorary}, ${valid_workhike})
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});
