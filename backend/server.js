const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use(helmet());
app.use(morgan('common'));

connectDB();
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
	res.send('Server running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

module.exports = app; // For testing
