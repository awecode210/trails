const mongoose = require("mongoose");



const DB1 = process.env.DB1; // Your first database URL
const connection1 = mongoose.createConnection(DB1, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Listen for connection events
connection1.once('open', () => {
    console.log("Database 1 Connected");
});

connection1.on('error', (err) => {
    console.log("Error connecting to Database 1:", err);
});


const partnershipDB = process.env.partnership; // Your partnership database URL
const partnershipConnection = mongoose.createConnection(partnershipDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Listen for connection events
partnershipConnection.once('open', () => {
    console.log("Partnership Database Connected");
});

partnershipConnection.on('error', (err) => {
    console.log("Error connecting to Partnership Database:", err);
});

module.exports = {
    partnershipConnection,
    connection1
};