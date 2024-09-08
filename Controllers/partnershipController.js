// const users = require("../models/usersSchema");
// const chat_models = require('../models/user_chats.js');
const mongoose = require('mongoose');
const Partnership = require("../models/Partnershipprofile")


// Correct this please unique id issue 
//  user_name add this later 
exports.createPartnership = async (req, res) => {
    const { 
        name, 
        creator, 
        business, 
        dealvalue, 
        businesstype, 
        creatortype, 
        platform, 
        targetaudience, 
        contenttype, 
        location, 
        ispremium = false 
    } = req.body;

    const lowerCaseName = name.toLowerCase();
    console.log("lowerCaseName", lowerCaseName);

    try {
        // Check if a partnership with the same name already exists
        const existingPartnership = await Partnership.findOne({ name: lowerCaseName });

        if (existingPartnership) {
            return res.status(400).json({ message: 'A partnership with this name already exists.' });
        }

        // Create a new partnership document
        const newPartnership = new Partnership({
            name: lowerCaseName, // Ensure the name is stored in lowercase
            creator,
            business,
            dealvalue,
            businesstype,
            creatortype,
            platform,
            targetaudience,
            contenttype,
            location,
            ispremium
        });

        // Save the new partnership document to the database
        await newPartnership.save();

        // Send a success response
        res.status(201).json({ message: 'Partnership created successfully', partnership: newPartnership });
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ message: 'Error creating partnership', error });
    }
}


// to
// Function to find all partnerships
exports.findAll = async (req, res) => {
    try {
        const partnerships = await Partnership.find(); // Retrieve all partnerships

        // Send the fetched data as the response
        res.status(200).json(partnerships);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error });
    }
};


// to
// Function to find a partnership by creator ID
exports.findOneByCreator = async (req, res) => {
    const { creatorId } = req.params; // Extract creator ID from request parameters

    try {
        const partnership = await Partnership.findOne({ creator: creatorId }); // Find partnership by creator ID

        if (!partnership) {
            return res.status(404).json({ message: 'Partnership not found' }); // Handle case where no partnership is found
        }

        res.status(200).json(partnership); // Send the found partnership as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnership', error }); // Handle errors
    }
};


// controllers/partnershipController.js

// to
// Function to find a partnership by business ID
exports.findOneByBusiness = async (req, res) => {
    const { businessid } = req.params; // Extract business ID from request parameters

    try {
        const partnership = await Partnership.findOne({ business: businessid }); // Find partnership by business ID

        if (!partnership) {
            return res.status(404).json({ message: 'Partnership not found' }); // Handle case where no partnership is found
        }

        res.status(200).json(partnership); // Send the found partnership as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnership', error }); // Handle errors
    }
};



// Function to find partnerships by date
exports.findByDate = async (req, res) => {
    const { date } = req.params; // Extract date from request parameters

    try {
        // Convert the date string to a Date object
        const searchDate = new Date(date);
        
        if (isNaN(searchDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' }); // Handle invalid date format
        }

        // Find partnerships created on the specified date
        const partnerships = await Partnership.find({
            createdAt: {
                $gte: searchDate.setHours(0, 0, 0, 0), // Start of the day
                $lt: searchDate.setHours(23, 59, 59, 999) // End of the day
            }
        });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No partnerships found for this date' }); // Handle case where no partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error }); // Handle errors
    }
};


// controllers/partnershipController.js


// Function to find partnerships by deal value
exports.findByDealValue = async (req, res) => {
    const { dealvalue } = req.params; // Extract deal value from request parameters
    // Validate dealvalue to ensure it is a number
    const numericDealValue = parseFloat(dealvalue);
    if (isNaN(numericDealValue)) {
        return res.status(400).json({ message: 'Invalid deal value' }); // Handle invalid deal value format
    }

    try {
        // Find partnerships with the specified deal value
        const partnerships = await Partnership.find({ dealvalue: numericDealValue });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No partnerships found for this deal value' }); // Handle case where no partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error }); // Handle errors
    }
};


// controllers/partnershipController.js

//Doen till here 
// Function to find partnerships by business type
exports.findByBusinessType = async (req, res) => {
    const { businesstype } = req.params; // Extract business type from request parameters

    try {
        // Find partnerships with the specified business type
        const partnerships = await Partnership.find({ businesstype });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No partnerships found for this business type' }); // Handle case where no partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error }); // Handle errors
    }
};



exports.findByCreatorType = async (req, res) => {
    const { creatortype } = req.params; // Extract creator type from request parameters

    try {
        // Find partnerships with the specified creator type
        const partnerships = await Partnership.find({ creatortype });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No partnerships found for this creator type' }); // Handle case where no partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error }); // Handle errors
    }
};


// Function to find partnerships by platform
exports.findByPlatform = async (req, res) => {
    const { platform } = req.params; // Extract platform from request parameters

    try {
        // Find partnerships with the specified platform
        const partnerships = await Partnership.find({ platform });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No partnerships found for this platform' }); // Handle case where no partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error }); // Handle errors
    }
};

// controllers/partnershipController.js


// Function to find partnerships by target audience
exports.findByTargetAudience = async (req, res) => {
    const { targetaudience } = req.params; // Extract target audience from request parameters

    try {
        // Find partnerships with the specified target audience
        const partnerships = await Partnership.find({ targetaudience });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No partnerships found for this target audience' }); // Handle case where no partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error }); // Handle errors
    }
};


exports.findByContentType = async (req, res) => {
    const { contenttype } = req.params; // Extract content type from request parameters

    try {
        // Find partnerships with the specified content type
        const partnerships = await Partnership.find({ contenttype });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No partnerships found for this content type' }); // Handle case where no partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error }); // Handle errors
    }
};



// Function to find partnerships by location
exports.findByLocation = async (req, res) => {
    const { location } = req.params; // Extract location from request parameters

    try {
        // Find partnerships with the specified location
        const partnerships = await Partnership.find({ location });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No partnerships found for this location' }); // Handle case where no partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving partnerships', error }); // Handle errors
    }
};



// Function to find partnerships in the premium list
exports.findInPremiumList = async (req, res) => {
    try {
        // Find partnerships where isPremium is true
        const partnerships = await Partnership.find({ ispremium: true });

        if (partnerships.length === 0) {
            return res.status(404).json({ message: 'No premium partnerships found' }); // Handle case where no premium partnerships are found
        }

        res.status(200).json(partnerships); // Send the found partnerships as the response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving premium partnerships', error }); // Handle errors
    }
};




exports.updateCreator = async (req, res) => {
    const { id } = req.params; // Partnership ID
    const { creator } = req.body; // New creator ID (string)


    try {
        // Convert partnership ID to ObjectId
        const partnershipObjectId = mongoose.Types.ObjectId(id);

        // Find and update the partnership document
        const updatedPartnership = await Partnership.findByIdAndUpdate(
            partnershipObjectId,
            { creator: creator }, // Directly assign the string value
            { new: true, runValidators: true }
        );

        if (!updatedPartnership) {
            return res.status(404).json({ message: 'Partnership not found' });
        }

        res.status(200).json(updatedPartnership);
    } catch (error) {
        console.error('Error updating creator:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteCreator = async (req, res) => {
    const { id } = req.params; // Partnership ID


    try {
        // Find and update the partnership document
        const updatedPartnership = await Partnership.findByIdAndUpdate(
            id, // Use the ID directly without conversion
            { creator: "Deleted" }, // Directly assign the string value
            { new: true, runValidators: true }
        );

        if (!updatedPartnership) {
            return res.status(404).json({ message: 'Partnership not found' });
        }

        res.status(200).json({ message: 'Creator deleted successfully', partnership: updatedPartnership });
    } catch (error) {
        console.error('Error updating creator:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
