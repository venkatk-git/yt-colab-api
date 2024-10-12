const express = require("express");
const app = require("./app");
const http = require("http");
const cors = require("cors");

const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);
app.use(express.urlencoded({ extended: true }));

const uuidv4 = require("uuid").v4;

const { PORT } = require("./config/variables");

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

const roomRoutes = require("./routes/room.routes");
app.use("/", roomRoutes);

const socketRoutes = require("./routes/socket.routes")(io);
app.use("/", socketRoutes);

httpServer.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});
