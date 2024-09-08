const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { User, AdminTeam } = require("../db");

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('unable to authenticate.')
        return res.status(403).json({ message: "unable to authenticate." })
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.email) {
            req.userId = (await User.findOne({ email: decoded.email }))._id;
            next();
        } else {
            return res.status(403).json({ message: " invalid token." })
        }
    } catch (err) {
        return res.status(403).json({ message: "some error occured." });
    }
};

async function adminTeamMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('unable to authenticate.')
        return res.status(403).json({ message: "unable to authenticate." })
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.email) {
            req.adminId = (await AdminTeam.findOne({ email: decoded.email }))._id;
            next();
        } else {
            return res.status(403).json({ message: " invalid token." })
        }
    } catch (err) {
        return res.status(403).json({ message: "some error occured." });
    }
};

module.exports = {
    authMiddleware,
    adminTeamMiddleware
}