const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
})
    .then(res => { console.log("connected to database") })
    .catch(error => { console.log("connection to database failed -> ", error) });

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    accountType: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    }
})

const adminTeamSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    accountType: {
        type: String,
        default: "admin",
        immutable: true
    }
})

const creatorSchema = mongoose.Schema({
    profile: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            immutable: true
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            // required: true,
            trim: true,
        },
        dob: {
            type: Date,
            // required: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer not say'],
            // required: true
        },
        ethnicity: {
            type: String,
            enum: ['Asian', 'Black or African American', 'Native Hawaiian', 'Latin American', 'Arab', 'Pacific Islander', 'Irish', 'prefer not say'],
            // required: true
        },
        contact: {
            phoneNumber: {
                type: Number,
                trim: true,
                // required: false,
                minLength: 10,
                maxLength: 12
            },
            email: {
                type: String,
                // requirued: true,
                minLength: 5
            }
        },
        social: {
            linkedIn: {
                type: String,
                // required: false,
                trim: true
            },
            facebook: {
                type: String,
                // required: false,
                trim: true
            },
            x: {
                type: String,
                // required: false,
                trim: true
            },

        },
        location: {
            city: {
                type: String,
                // required: false
            },
            state: {
                type: String,
                // required: false
            },
            country: {
                type: String,
                // required: true
            },
            region: {
                type: String,
                // required: true,
                enum: ['Asia', 'Africa', 'North America', 'South America', 'Europe', 'Arctic', 'Antarctica']

            }
        },
        profilePicture: {
            type: String,
            // required: false
        }
    },
    work: {
        contentType: {
            type: String,
            enum: ['video', 'music', 'posts', 'movie', 'teacher', 'influencer', 'kids']
        },
        targetAudience: {
            type: String,
            enum: ['kids', 'teenagers', 'adults', 'old', 'teenagers and adults', 'adults and old']
        },
        totalFollowers: {
            type: Number,
            // required: true,
        },
        popularPosts: [{
            type: String,
        }],
        previousContracts: [{
            type: String,
        }],
        platforms: {
            youtube: {
                subscribers: {
                    type: Number
                },
                totalVideos: {
                    type: Number,
                },
                popularVideos: [{
                    type: String,
                }],
                sponcers: [{
                    type: String,
                }]
            },
            instagram: {
                followers: {
                    type: Number
                },
                totaPosts: {
                    type: Number,
                },
                popularPosts: [{
                    type: String,
                }],
                sponcers: [{
                    type: String,
                }]
            }
        }
    },
    professional: {
        netWorth: {
            type: Number, //----- in $
        },
        ownedBusiness: [{
            type: String,
        }]
    }
})

const User = mongoose.model("User", userSchema);
const AdminTeam = mongoose.model("AdminTeam", adminTeamSchema);
const Creator = mongoose.model("Creator", creatorSchema);

module.exports = { User, AdminTeam, Creator };