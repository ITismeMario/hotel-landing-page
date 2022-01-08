const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use(helmet());
app.use(morgan('common'));

connectDB();

app.get('/', (req, res) => {
	res.send('Server running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

module.exports = app; // For testing
