const mongoose = require("mongoose");
const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

// Listen for database connection errors
mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

// Export the mongoose connection object
module.exports = mongoose.connection;