const express = require("express");
const app = require("./app");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const { PORT, CLIENT_ORIGIN } = require("./config/variables");
const httpServer = http.createServer(app);

// Configure CORS for Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: CLIENT_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
    })
);

// Configure CORS for Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const roomRoutes = require("./routes/room.routes");
app.use("/", roomRoutes);

const socket = require("./socket");
socket(io);

httpServer.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});
