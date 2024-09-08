
// const users = require("../models/usersSchema");
const chat_models = require('../models/user_chats');






exports.get_contacts_busi = async (req, res) => {

  try {

    const businesses = await chat_models.BusinessProfile.find();

    // Send the fetched data as the response
    res.status(200).json(businesses);


  } catch (error) {
    res.status(500).json({ message: 'Error adding data' });
  }




}


exports.get_contacts_admin = async (req, res) => {

  try {

    const businesses = await chat_models.AdminProfile.find();

    // Send the fetched data as the response
    res.status(200).json(businesses);

  } catch (error) {
    res.status(500).json({ message: 'Error adding data' });
  }

}


exports.message_data = async (req, res) => {
  const { senderID, receiverID, message, timestamp, delivered } = req.body;

  try {
    // Create a new message document
    const newMessage = new chat_models.Message({
      senderID,
      receiverID,
      message,
      timestamp,
      delivered
    });

    // Save the message to the database
    await newMessage.save();

    // Return success response with the saved message data
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Error saving message:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.get_message_data = async (req, res) => {
  const { userID } = req.params; // Assuming userID is the sender ID
  const { receiverID } = req.query; // Assuming receiverID is provided as a query parameter


  // console.log("Sender Id",  userID)
  // console.log("receiver id",  receiverID)
  // console.log("new()")

  if (!receiverID) {
    return res.status(400).json({ message: 'ReceiverID is required' });
  }

  try {
    // Find messages where the user is either the sender or receiver
    let messages = await chat_models.Message.find({
      $or: [
        { senderID: userID, receiverID: receiverID },
        { senderID: receiverID, receiverID: userID }
      ]
    });

    // Check if any messages were found
    if (!messages || messages.length === 0) {
      messages = []
      return res.status(404).json({ message: 'No messages found between these users', messages });
    }

    // Return the messages found
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ message: 'Error retrieving messages' });
  }
};



// Signup Function
exports.signup = async (req, res) => {
  const { fname, email, password } = req.body;


  try {
    // Check if user with the email already exists
    let user = await chat_models.AdminProfile.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });

    }

    // Create a new user
    user = new chat_models.AdminProfile({
      fname,
      email,
      password
    });

    console.log('user', user);

    // Save the user to the database
    await user.save();

    // Return success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.busisignup = async (req, res) => {
  const { fname, email, password } = req.body;



  try {
    // Check if user with the email already exists
    let user = await chat_models.BusinessProfile.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });

    }

    // Create a new user
    user = new chat_models.BusinessProfile({
      fname,
      email,
      password
    });
    console.log('user', user);

    // Save the user to the database
    await user.save();

    // Return success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};


// Sign In

exports.signin = async (req, res) => {
  const { email, password, userType } = req.body;

  console.log(req.body)
  try {

    // Check userType to determine which database to query
    if (userType === 'admin') {
      user = await chat_models.AdminProfile.findOne({ email });
    } else if (userType === 'business') {
      user = await chat_models.BusinessProfile.findOne({ email });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // If user is not found
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the password
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate token
    const token = await user.generateAuthToken();

    // Set cookie
    res.cookie("usercookie", token, {
      expires: new Date(Date.now() + 9000000),
  
    });

    const result = {
      user,
      token
    };

    res.status(200).json({ message: 'Signed in successfully', result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};


// Change this please 
exports.validuser = async (req, res) => {

  console.log("done")

  try {
    const ValidUserOne = await chat_models.AdminProfile.findOne({ _id: req.userId });
    res.status(200).json({ status: 200, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};



// ONLY FOR TESTIGN DO NOT USE THIS API AT ALL 

// Controller Function to Delete All Messages in the Collection
exports.delete_all_messages = async (req, res) => {
  try {
    // Delete all documents in the Message collection
    await chat_models.Message.deleteMany({});

    // Return a success response
    res.status(200).json({ message: 'All messages have been deleted successfully' });
  } catch (error) {
    console.error('Error deleting all messages:', error);
    res.status(500).json({ message: 'Error deleting all messages' });
  }
};