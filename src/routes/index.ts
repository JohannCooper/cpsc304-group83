
import { Router } from 'express';
import bodyParser from 'body-parser';

import { router as databaseRouter } from './database';
import { router as exampleRouter } from './example';
import { router as meetingRouter } from './meeting';
import { router as tripMeetingRouter } from './getTripMeeting';
import { router as experiencedRouter } from './mostExperiencedAttendee';

let v1Router: Router;

export function router(): Router {
  v1Router = Router();

  // middleware
  v1Router.use(bodyParser.json());
  v1Router.use(bodyParser.urlencoded({ extended: true }));

  // insert new routers below
  v1Router.use('/database', databaseRouter);
  v1Router.use('/example', exampleRouter);
  v1Router.use('/meeting', meetingRouter);
  v1Router.use('/tripmeeting', tripMeetingRouter);
  v1Router.use('/mostExperiencedAttendee', experiencedRouter);

  return v1Router;
}