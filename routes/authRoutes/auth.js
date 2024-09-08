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
const { User } = require("../../db");
const JWT_SECRET = process.env.JWT_SECRET;
const { authMiddleware } = require("../../middlewares/middleware");

const authRouter = express.Router();
authRouter.use(express.json());

const signupSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string().min(2),
    lastName: zod.string().min(2),
    accountType: zod.string()
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

authRouter.get("/", (req, res) => {
    return res.json({ msg: "connected to auth Router" })
})

authRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(body);
    if (!success) {
        console.log(success);
        return res.status(411).json({ msg: "incorrect credentials" })
    }

    try {
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            console.log("user already exists -> ", existingUser.email);
            return res.status(411).json({ msg: "user already registered" })
        } else {
            console.log("in else");
            const user = await User.create({
                email: body.email,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName,
                accountType: body.accountType
            })

            const token = jwt.sign({
                email: user.email
            }, JWT_SECRET)
            console.log("user created successfully");
            return res.json({ token, msg: "signed up successfully" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "Bad input" });
    }
})

authRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(body);
    if (!success) {
        console.log(success);
        return res.status(411).json({ msg: "incorrect credentials" })
    }

    try {
        const user = await User.findOne({
            email: body.email,
            password: body.password,
        })
        if (!user) {
            console.log("user does not exist");
            return res.status(403).json({ msg: "user does not exist" });
        }
        const token = jwt.sign({
            email: body.email
        }, JWT_SECRET)

        console.log("user signed in successfully");
        return res.json({ token, msg: "signed in successfully" });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ msg: "Bad input" });
    }
})

authRouter.put("/update", authMiddleware, async (req, res) => {
    const body = req.body;
    const { success } = updateSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({ msg: "incorrect credentials" })
    }

    try {
        const user = await User.findOneAndUpdate({ _id: req.userId }, body);
        if (user) {
            console.log("user updated successfully -> ", user);
            return res.json({ msg: "user update successfully" });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "Failed to update" });
    }
})

authRouter.delete("/delete", authMiddleware, async (req, res) => {
    const body = req.body;
    const { success } = updateSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({ msg: "incorrect credentials" })
    }

    try {
        const user = await User.findOneAndDelete({ _id: req.userId });
        if (user) {
            console.log("user deleted successfully -> ", user);
            return res.json({ msg: "user deleted successfully" });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "Failed to delete" });
    }
})

module.exports = { authRouter }