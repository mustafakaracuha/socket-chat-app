const { Server } = require("socket.io");
const { createProxyMiddleware } = require("http-proxy-middleware");

const httpServer = require("http").createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("okay");
});

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Socket.IO bağlantıları için eventler
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

// HTTP proxy middleware oluşturma
const apiProxy = createProxyMiddleware("/api/socket.io", {
    target: "https://react-socket-chats.vercel.app",
    ws: true,
    changeOrigin: true,
    pathRewrite: {
        "^/api/socket.io": "/api/socket.io",
    },
});

module.exports = (req, res) => {
    if (req.url.startsWith("/api/socket.io")) {
        apiProxy(req, res);
    } else {
        // Diğer durumlarda normal işlem
        httpServer(req, res);
    }
};
