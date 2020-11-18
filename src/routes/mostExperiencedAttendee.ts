import { Router, Request, Response } from 'express';
import { queryDatabase } from '../database';

export const router = Router();

router.get('/:tripID', async (req: Request, res: Response) => {
	try {
		const { tripID: id } = req.params;

		const results = await queryDatabase(`
			SELECT t.full_name, t.tripCount
			FROM (SELECT m.full_name, COUNT(*)
				  FROM member m, attends_trip at1
				  WHERE m.member_id = at1.member_id AND m.member_ID IN (SELECT member_ID
				  														FROM atttends_trip at2
				  														WHERE at2.trip_id = id)
				  GROUP BY m.member_id) AS Temp
			WHERE t.tripCount = (SELECT MAX(Temp.tripCount) FROM Temp;
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

/**
WITH Temp(full_name, tripCount) AS
	SELECT m.full_name, COUNT(*)
	FROM member m, attends_trip attendT
	WHERE m.member_id = attendT.member_id AND m.member_ID IN (SELECT member_ID
															  FROM attends_trip at2
															  WHERE at2.trip_id = id)
	GROUP BY m.member_id
SELECT t.full_name, t.tripCount
FROM Temp t
WHERE t.tripCount = (SELECT MAX(Temp.tripCount) FROM Temp;
*/