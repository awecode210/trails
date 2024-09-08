const { Schema } = require('mongoose');
const {partnershipConnection} = require('../db/conn');

const PartnershipSchema = new Schema({
    name: { type: String, required: true,  unique: true, lowercase: true  }, // Name of the partnership
   
    creator: { type: String, required: true }, // Reference to the creator's user profile stored as ObjectId
    business: { type: Schema.Types.ObjectId, ref: 'BusinessProfile', required: true }, // Reference to the business involved stored as ObjectId
   
    createdat: { type: Date, default: Date.now }, // Timestamp of when the partnership was created
    updatedat: { type: Date, default: Date.now }, // Timestamp of when the partnership was last updated
  
    dealvalue: { type: Number, required: true }, // Value of the deal
    businesstype: { type: String, required: true }, // Type of business (e.g., tech, retail)
    creatortype: { type: String, required: true }, // Type of creator (e.g., influencer, artist)
    platform: { type: String, required: true }, // Platform where the partnership is executed (e.g., Instagram, YouTube)
    targetaudience: { type: String, required: true }, // Target audience for the partnership (e.g., teenagers, professionals)
   
    contenttype: { type: String, required: true }, // Type of content (e.g., video, blog post)
    location: { type: String, required: true }, // Location where the partnership is focused (e.g., New York, Global)
    ispremium: { type: Boolean, default: false }, // Flag to indicate if it's a premium partnership
 
});

PartnershipSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Partnership = partnershipConnection.model('Partnership', PartnershipSchema, 'Partnership');

module.exports = Partnership;
