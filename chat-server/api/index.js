const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Socket.IO server is running");
});

const io = new Server(httpServer, {
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

httpServer.listen(3000, () => {
    console.log("Socket.IO server listening on port 3000");
});

module.exports = (req, res) => {
    if (req.url.startsWith("/api/socket.io")) {
        // Handle Socket.IO requests
        io.handleRequest(req, res);
    } else {
        // Handle other requests
        httpServer.emit("request", req, res);
    }
};
