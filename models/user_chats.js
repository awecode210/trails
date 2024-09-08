const { Schema } = require('mongoose');
const {connection1} = require('../db/conn'); // Import the MongoDB connection
const keysecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');

// Schema for user profiles (admin and business owners)
const adminProfileSchema = new Schema({
  fname: { type: String, required: true },
  email: { type: String, unique: true }, 
  password: { type: String, required: true }// Example field for admin contact
  // Add other admin-related fields as needed
});


const businessProfileSchema = new Schema({
  fname: { type: String, required: true },
  email: { type: String, unique: true }, 
  password: { type: String, required: true }// Example field for business contact
  // Add other business-related fields as needed
});

// Schema for messages
const messageSchema = new Schema({
  senderID: { type: String, required: true }, // User ID of the sender
  receiverID: { type: String, required: true }, // User ID of the receiver
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Default timestamp to current date/time
  delivered: { type: Boolean, default: false } // Field to track delivery status
});


adminProfileSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, keysecret, { expiresIn: "1d" });
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

businessProfileSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, keysecret, { expiresIn: "1d" });
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

const AdminProfile = connection1.model('AdminProfile', adminProfileSchema);


const BusinessProfile = connection1.model('BusinessProfile', businessProfileSchema);
// Use connection1 to create models


const Message = connection1.model('Message', messageSchema);

module.exports = {
  AdminProfile,
  BusinessProfile,
  Message
};
