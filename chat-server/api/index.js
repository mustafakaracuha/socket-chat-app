const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("okay");
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
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

server.listen(process.env.PORT || 3000, () => {
    console.log("Socket.IO server is running...");
});
