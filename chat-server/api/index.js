const { Server } = require("socket.io");
const { createServer } = require("http");

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("Socket.IO server is starting...");

        const httpServer = res.socket.server;

        const io = new Server(httpServer, {
            path: "/api/socket.io",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
            transports: ["websocket", "polling"],
        });

        res.socket.server.io = io;

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
    }
    res.end();
}
