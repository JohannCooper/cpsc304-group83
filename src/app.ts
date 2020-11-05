import express from 'express';

import { router as v1Router } from './routes';

const app = express();

app.use('/v1', v1Router());

export default app;