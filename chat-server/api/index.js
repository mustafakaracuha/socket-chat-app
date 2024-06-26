const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

// HTTP proxy middleware oluşturma
const apiProxy = createProxyMiddleware("/api", {
    target: "https://react-socket-chats.vercel.app", // Sunucu adresinizi buraya yazın
    ws: true,
    changeOrigin: true,
    pathRewrite: {
        "^/api": "", // İsteklerde "/api" kısmını kaldır
    },
});

app.use("/api", apiProxy);

const server = http.createServer(app);
const io = socketIo.io.attach(server, {
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

const PORT = process.env.PORT || 4000; // Vercel üzerinde PORT'un nasıl ayarlandığını dikkate alın
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;
