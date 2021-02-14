/* eslint-disable import/first */ // env variables should be loaded first
import express, { Application } from 'express';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import routes from './routes/allRoutes';
import './config/db';
const PORT = process.env.PORT || 5000;

const app: Application = express();

// express setting
app.set('env', process.env.NODE_ENV);

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
app.use(helmet()); // security headers
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}
app.use(cors({ credentials: true }));
app.use(compression()); // compress response bodies

app.use('/api', routes);

// to serve gzipped React app
if (app.get('env') === 'production') {
  app.use('/', expressStaticGzip('client/build', {}));
}
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
