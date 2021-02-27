/* eslint-disable import/first */ // env variables should be loaded first
import express, { Application } from 'express';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import passport from 'passport';
import expressStaticGzip from 'express-static-gzip';
import cookieParser from 'cookie-parser';
import routes from './routes/all.routes';
import './config/db';

const PORT = process.env.PORT || 5000;

const app: Application = express();

// express setting
app.set('env', process.env.NODE_ENV);

// middlewares
if (app.get('env') === 'production') {
  app.use(helmet()); // security headers
} else {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // since server is running on different PORT
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      },
    })
  );
}
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}
app.use(compression()); // compress response bodies

// passport middlewares
import './middlewares/passport';
app.use(passport.initialize());

app.use('/api', routes);

// to serve gzipped React app
if (app.get('env') === 'production') {
  app.use('/', expressStaticGzip('client/build', {}));
}
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
