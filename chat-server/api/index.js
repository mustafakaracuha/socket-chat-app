const { Server } = require("socket.io");

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("Socket.IO server is starting...");

        const io = new Server(res.socket.server, {
            path: "/api/socket.io",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
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
