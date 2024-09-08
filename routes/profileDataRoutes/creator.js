/**
 * ---------- todos ----------
 * 1.create (automated at backend), update route to be made for frontend (done)
 * 2.find all (done)
 * 3.find one , --- by email
 * 4.find by min followers
 * 5.find by platform
 * 6.find by target audience
 * 7.find by language
 * 8.find by content type
 * 9.find by location
 * 10.find by post frequency
 * 11.find by premium list
 * 12.update creator
 * 13.delete creator
 * 14.creator in partnership
 */

const express = require("express");
const { authMiddleware, adminTeamMiddleware } = require("../../middlewares/middleware");
const { User, Creator } = require("../../db");


const creatorRouter = express.Router();
creatorRouter.use(express.json());

creatorRouter.get("/", (req, res) => {
    console.log("connected to creator router")
    return res.json({ msg: "connected to creator router" });
})

//------- create and update route to be accessed by users.
creatorRouter.post("/update", authMiddleware, async (req, res) => {
    let user;
    const body = req.body;
    //  ----- verify the user exixts , although we have verified it earlier in middleware, will remove this later
    try {
        user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(403).json({ msg: "unauthorised access" });
        }
    } catch (error) {
        console.log("./routes/creator -> updateroute -> failed to find user ");
        return res.status(500).json({ msg: "some server error occured" });
    }

    try {
        let creator = await Creator.findOne({ 'profile.userId': user._id });
        // ----- if new signup create new creator
        // console.log(creator);
        console.log("req.userId -> ", req.userId);
        console.log(creator);
        if (!creator) {
            console.log("./routes/creator -> updateroute -> in if condition ");
            await Creator.create({

                // 'profile.userId': user._id,
                // 'profile.firstName': user.firstName,
                // 'profile.lastName': user.lastName,
                // 'profile.contact.email': user.email,


                profile: {
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    contact: {
                        email: user.email
                    }
                }
            });
            console.log("new creator created");
        }

        // ----- update creator
        const updateCreator = await Creator.findOne({ 'profile.contact.email': user.email });
        console.log("updateCreator => ", updateCreator);
        const updatedCreator = await Creator.findOneAndUpdate({
            'profile.userId': user._id
        }, {
            'profile.dob': body.profile.dob,
            'profile.gender': body.profile.gender,
            'profile.ethnicity': body.profile.ethnicity,
            'profile.contact.phoneNumber': body.profile.contact.phoneNumber,
            'profile.contact.email': body.profile.contact.email,
            'profile.social.linkedIn': body.profile.social.linkedIn,
            'profile.social.facebook': body.profile.social.facebook,
            'profile.social.x': body.profile.social.x,
            'profile.location.city': body.profile.location.city,
            'profile.location.state': body.profile.location.state,
            'profile.location.country': body.profile.location.country,
            'profile.location.region': body.profile.location.region,
            'profile.profilePicture': body.profile.profilePicture, //-------- url of object store profile picture location

            'work.contentType': body.work.contentType,
            'work.targetAudience': body.work.targetAudience,
            'work.totalFollowers': body.work.totalFollowers,
            'work.popularPosts': body.work.popularPosts,
            'work.previousContracts': body.work.previousContracts,
            'work.platforms.youtube.subscribers': body.work.platforms.youtube.subscribers,
            'work.platforms.youtube.totalVideos': body.work.platforms.youtube.totalVideos,
            'work.platforms.youtube.popularVideos': body.work.platforms.youtube.popularVideos, //-----array
            'work.platforms.youtube.sponcers': body.work.platforms.youtube.sponcers, //-----array
            'work.platforms.instagram.followers': body.work.platforms.instagram.followers,
            'work.platforms.instagram.totalPosts': body.work.platforms.instagram.totalPosts,
            'work.platforms.instagram.popularPosts': body.work.platforms.instagram.popularPosts, //-----array
            'work.platforms.instagram.sponcers': body.work.platforms.instagram.sponcers, //-----array

            'professional.netWorth': body.professional.netWorth, //----- in $
            'professional.ownedBusiness': body.professional.ownedBusiness //-----array
        }, {
            returnOriginal: false
        });

        console.log("./routes/creator -> updateroute -> creator detailes updated successfully ");
        return res.json({ msg: "creator detailes updated successfully" })
    } catch (error) {
        console.log("./routes/creator -> updateroute -> error updating creator data ->", error);
        return res.status(500).json({ msg: "some server error occured" });
    }
})

//------- find all route to be accessed by creatorship team.
creatorRouter.get("/allcreators", adminTeamMiddleware, async (req, res) => {
    try {
        const creators = await Creator.find();
        return res.json(creators)
    } catch (error) {
        console.log("./routes/creator -> allcreators -> unable to fetch creators ->", error);
        return res.status(500).json({ msg: "some server error occured" });
    }
});

creatorRouter.get("/find/:email/:followers/:platform/:targetAudience/:language/:contentType/:region/:country/:isInPartnership", adminTeamMiddleware, async (req, res) => {
    const email = req.params["email"];
    const followers = req.params["followers"];
    const platform = req.params["platform"];
    const targetAudience = req.params["targetAudience"];
    const language = req.params["language"];
    const contentType = req.params["contentType"];
    const region = req.params["region"];
    const country = req.params["country"];
    const isInPartnership = req.params["isInPartnership"];

    const filter = {};
    if (email) filter.profile.contact.email = email;
    if (followers) filter.profile.contact.followers = followers;
    if (platform) filter.email = email;
    if (targetAudience) filter.work.targetAudience = targetAudience;
    if (language) filter.email = email;
    if (contentType) filter.work.contentType = contentType;
    if (region) filter.profile.location.region = region;
    if (country) filter.profile.location.country = country;
    if (isInPartnership) filter.email = email;
    try {
        const creators = await Creator.find();
        return res.json(creators)
    } catch (error) {
        console.log("./routes/creator -> allcreators -> unable to fetch creators ->", error);
        return res.status(500).json({ msg: "some server error occured" });
    }
});






module.exports = { creatorRouter }