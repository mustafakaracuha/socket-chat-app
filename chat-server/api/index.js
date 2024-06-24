const { Server } = require("socket.io");
const { createServer } = require("http");

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("Socket.IO server is starting...");

        const httpServer = createServer((req, res) => {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("okay");
        });

        const io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
            transports: ["websocket", "polling"],
        });

        res.socket.server.io = io;
        res.socket.server.httpServer = httpServer;

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

        httpServer.listen(process.env.PORT || 3000, () => {
            console.log("Socket.IO server is running...");
        });
    }
    res.end();
}
