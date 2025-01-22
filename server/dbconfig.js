// Import mongoose

import mongoose from "mongoose";

// Get the connection string from environment variables
//const connectionString = process.env.CONN_STRING;

// if (!connectionString) {
//     console.error("Connection string not found in environment variables!");
//     process.exit(1); // Exit the application if the connection string is missing
// }

// Connect to MongoDB
const conn_string="mongodb+srv://rupak:rupak2003@cluster0.fcbka.mongodb.net/real-chat";
mongoose.connect(conn_string);

// Get the default connection
const db = mongoose.connection;

// Connection events
db.on("connected", () => {
    console.log("Database connection successful!");
});

db.on("error", (error) => {
    console.error("Database connection failed:", error);
});

db.on("disconnected", () => {
    console.log("Database disconnected.");
});

// Export the connection
export default db;
