require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const port = 6010;
const app = express();
require("./db/conn");

const server = http.createServer(app);  // Use HTTP server
// Import and initialize the Socket.IO module
require('./sockets/socket')(server);

app.use(express.json());
app.use(cors());
app.use(cookieParser());




const { authRouter } = require("./routes/authRoutes/auth");
const { creatorRouter } = require("./routes/profileDataRoutes/creator");
const { adminRouter } = require("./routes/authRoutes/admin");
const messages = require("./routes/messagesRoutes/messagesRoutes");
const partnerShipro = require("./Routes/partnershipRoutes/partnership");
// add file path 


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/creator", creatorRouter);
app.use("/api/v1/messages",messages);
app.use("/api/v1/partnership", partnerShipro);

app.get("/", (req, res) => {
    return res.json({ msg: "connected to backend" })
})



server.listen(port, () => { console.log("listing at", port) });    