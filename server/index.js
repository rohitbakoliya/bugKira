const express = require('express');
const app = express();

const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

// express setting
app.set('env', process.env.NODE_ENV);

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
app.use(helmet()); // security headers
app.use(morgan('dev'));
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression()); // compress response bodies

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

app.use('/', (req, res) => res.send('hello world'));

app.use('/api/*', (req, res) => {
  res.json({ error: 'No endpoint found!' });
});
