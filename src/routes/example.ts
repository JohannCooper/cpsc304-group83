import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
	console.log('Route params', req.params);
	console.log('GET params', req.query);
	console.log('POST body', req.body);

	res.status(200);
	res.json({ key: "value" });
});