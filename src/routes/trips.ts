import { Router, Request, Response } from 'express';
import { queryDatabase } from '../database';

export const router = Router();

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
