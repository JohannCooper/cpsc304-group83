
import { Router } from 'express';
import bodyParser from 'body-parser';

import { router as exampleRouter } from './example';

let v1Router: Router;

export function router(): Router {
  v1Router = Router();
  v1Router.use(bodyParser.json());
  v1Router.use(bodyParser.urlencoded({ extended: true }));

  v1Router.use('/example', exampleRouter);
  // insert other routers here

  return v1Router;
}