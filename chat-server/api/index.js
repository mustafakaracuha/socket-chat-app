const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("chat message", (msg) => {
        const messageObject = {
            user: msg.user,
            text: msg.text,
            date: new Date().toLocaleString(),
        };
        io.emit("chat message", messageObject);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
