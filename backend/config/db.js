const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		console.log(`Connected to MongoDB: ${conn.connection.host}`);
	} catch (error) {
		console.error(`An error has ocurred ${error}`);
		process.exit();
	}
};

module.exports = connectDB;
