import express from 'express';
import cors from 'cors';

import { middleware as database } from './database';

import { router as v1Router } from './routes';

const app = express();

// middleware
app.use(cors());
app.use(database);

// routers
app.use('/v1', v1Router());

export default app;