import { Router, Request, Response } from 'express';
import { queryDatabase } from '../database';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
	try {
		const { name } = req.query;

		const results = await queryDatabase(`
			SELECT *
			FROM example
			WHERE name = '${name}';
		`);

		res.json({ data: results });
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;

		await queryDatabase(`
			INSERT INTO example (name, description)
			VALUES ('${name}', '${description}');
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.put('/:exampleId', async (req: Request, res: Response) => {
	try {
		const { exampleId: id } = req.params;
		const { description } = req.body;

		await queryDatabase(`
			UPDATE example
			SET description = '${description}'
			WHERE id = '${id}';
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});

router.delete('/:exampleId', async (req: Request, res: Response) => {
	try {
		const { exampleId: id } = req.params;

		await queryDatabase(`
			DELETE FROM example
			WHERE id = '${id}';
		`);

		res.sendStatus(200);
	} catch (err) {
		res.status(400);
		res.json({ error: err });
	}
});