import { Router, Request, Response } from 'express';
import { initializeDatabase } from '../database/init';
import { resetDatabase } from '../database/reset';

export const router = Router();

router.post('/init', async (req: Request, res: Response) => {
	try {
		await initializeDatabase();
		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.post('/reset', async (req: Request, res: Response) => {
	try {
		await resetDatabase();
		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});