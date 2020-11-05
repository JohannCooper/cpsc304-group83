import express from 'express';

import { middleware as database } from './database';

import { router as v1Router } from './routes';

const app = express();

// middleware
app.use(database);

// routers
app.use('/v1', v1Router());

export default app;