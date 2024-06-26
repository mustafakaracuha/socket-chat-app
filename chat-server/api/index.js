const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const httpServer = createServer(app);
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

const apiProxy = createProxyMiddleware("/api/socket.io", {
    target: "https://react-socket-chats.vercel.app",
    ws: true,
    changeOrigin: true,
    pathRewrite: {
        "^/api/socket.io": "/api/socket.io",
    },
});

app.use("/api/socket.io", apiProxy);

app.use((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("okay");
});

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});
