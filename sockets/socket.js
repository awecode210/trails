const socketIO = require("socket.io");
const chat_models = require('../models/user_chats');

module.exports = function (server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        const { userId } = socket.handshake.query;

        if (userId !== "undefined") {
            // Join the user-specific room
            socket.join(userId);
            
            // Get all socket IDs connected to the user-specific room
            const socketsInRoom = io.sockets.adapter.rooms.get(userId);
            const socketIds = socketsInRoom ? Array.from(socketsInRoom) : [];
    
            // console.log(`User ${userId} connected with socket ID: ${socket.id}`);
            // console.log(`Room for User ${userId} now has socket IDs: ${socketIds.join(', ')}`);
        }
        socket.on('send-message', async (data) => {
            const { senderID, recipientID, message } = data;

            const newMessage = {
                senderID: senderID,
                receiverID: recipientID,
                message,
                timestamp: new Date(),
                delivered: false // Initially set to false
            };

            const recipientSockets = io.sockets.adapter.rooms.get(recipientID);
            if (recipientSockets && recipientSockets.size > 0) {
                // If the recipient is online, send the message first, then save it
                io.to(recipientID).emit('receive-message', newMessage);
                newMessage.delivered = true; // Mark as delivered since it was broadcasted
            } 

            await saveMessage(newMessage);

            // Broadcast the sent message to all sessions of the sender
            io.to(senderID).emit('message-sent', newMessage);

            // Log the socket IDs that are supposed to receive the broadcast
            const senderSockets = io.sockets.adapter.rooms.get(senderID);
            const senderSocketIds = senderSockets ? Array.from(senderSockets) : [];

            console.log(`Broadcasting message to sender ${senderID} on socket IDs: ${senderSocketIds.join(', ')}`);
            console.log('Message being broadcasted:', newMessage);

        });

        socket.on('disconnect', () => {
            console.log(`Socket ID ${socket.id} disconnected for user ${userId}`);
            socket.leave(userId);
        });
    });

    async function saveMessage(message) {
        console.log("Saving message");
        const newMessage = new chat_models.Message(message);
        await newMessage.save();
    }
};
