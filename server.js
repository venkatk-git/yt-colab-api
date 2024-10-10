const express = require("express");
const app = require("./app");
const http = require("http");

const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);

const uuidv4 = require("uuid").v4;

const { PORT } = require("./config/variables");
const { url } = require("inspector");

app.use(express.json());

const connections = {};
const users = {};
const rooms = {};

function createRoom() {
    return uuidv4();
}

app.post("/create-room/:admin", (req, res) => {
    const { admin } = req.params;
    const roomId = createRoom();

    rooms[roomId] = {
        admin,
        members: [],
    };

    return res.status(201).json({
        roomId,
        room: rooms[roomId],
    });
});

app.get("/join-room/:roomId/:user", (req, res) => {
    const { roomId, user } = req.params;

    rooms[roomId] = {
        ...rooms[roomId],
        members: [...rooms[roomId].members, user],
    };

    return res.status(200).json({
        roomId,
        room: rooms[roomId],
    });
});

io.on("connection", (socket) => {
    const roomId = createRoom();

    socket.join(roomId);
    connections[uuid] = socket;

    console.log(connections);
});

httpServer.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});
