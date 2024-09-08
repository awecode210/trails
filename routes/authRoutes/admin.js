/**
 * Todo
 * 1. signin route (done)
 * 2. signup route (done)
 * 3. zod validation (done)
 * 4. password hashing----------------------------(not done)
 * 5. jwt (done)
 * 6. middlware (done)
 */

const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const { AdminTeam } = require("../../db");
const JWT_SECRET = process.env.JWT_SECRET;
const { adminTeamMiddleware } = require("../../middlewares/middleware");

const adminRouter = express.Router();
adminRouter.use(express.json());

const signupSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string().min(2),
    lastName: zod.string().min(2)
})

const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
})

const updateSchema = zod.object({
    password: zod.string().min(6).optional().or(zod.literal('')),
    firstName: zod.string().min(2).optional().or(zod.literal('')),
    lastName: zod.string().min(2).optional().or(zod.literal(''))
});

const deleteSchema = zod.object({
    password: zod.string().min(6).optional().or(zod.literal(''))
})

adminRouter.get("/", (req, res) => {
    return res.json({ msg: "connected to auth Router" })
})

adminRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(body);
    if (!success) {
        console.log(success);
        return res.status(411).json({ msg: "incorrect credentials" })
    }

    try {
        const existingUser = await AdminTeam.findOne({ email: body.email });
        if (existingUser) {
            console.log("user already exists -> ", existingUser.email);
            return res.status(411).json({ msg: "user already registered" })
        } else {
            console.log("in else");
            const user = await AdminTeam.create({
                email: body.email,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName
            })
            const token = jwt.sign({
                email: user.email
            }, JWT_SECRET)
            console.log("admin created successfully");
            return res.json({ token, msg: "admin signed up successfully" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "Bad input" });
    }
})

adminRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(body);
    if (!success) {
        console.log(success);
        return res.status(411).json({ msg: "incorrect credentials" })
    }
    try {
        const user = await AdminTeam.findOne({
            email: body.email,
            password: body.password,
        })
        if (!user) {
            console.log("admin does not exist");
            return res.status(403).json({ msg: "admin does not exist" });
        }
        const token = jwt.sign({
            email: body.email
        }, JWT_SECRET)

        console.log("admin signed in successfully");
        return res.json({ token, msg: "admin signed in successfully" });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ msg: "Bad input" });
    }
})

adminRouter.put("/update", adminTeamMiddleware, async (req, res) => {
    const body = req.body;
    const { success } = updateSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({ msg: "incorrect credentials" })
    }

    try {
        const user = await AdminTeam.findOneAndUpdate({ _id: req.adminId }, body);
        if (user) {
            console.log("user updated successfully -> ", user);
            return res.json({ msg: "user update successfully" });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "Failed to update" });
    }
})

//--------------- define administratorMiddleware
// adminRouter.delete("/delete/:uuid", administratorMiddleware, async (req, res) => {
//     const uuid = req.params["uuid"];
//     const body = req.body;
//     const { success } = updateSchema.safeParse(body);
//     if (!success) {
//         return res.status(411).json({ msg: "incorrect credentials" })
//     }

//     try {
//         const user = await AdminTeam.findOneAndDelete({ _id: req.userId });
//         if (user) {
//             console.log("user deleted successfully -> ", user);
//             return res.json({ msg: "user deleted successfully" });
//         }

//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({ msg: "Failed to delete" });
//     }
// })

module.exports = { adminRouter }