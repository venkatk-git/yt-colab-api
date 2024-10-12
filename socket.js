const { joinRoom, createRoom } = require("./handlers/room.handler");

const connections = {};
const rooms = {};

module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("room:create", ({ roomId, admin }) => {
            createRoom(roomId, admin, socket, connections, rooms);
        });

        socket.on("room:join", ({ roomId, user }) => {
            joinRoom(roomId, user, socket, connections, rooms);
        });

        socket.on("disconnect", () => {
            const userToRemove = Object.keys(connections).find(
                (uuid) => connections[uuid].socket === socket
            );

            if (!userToRemove) {
                console.log("User does not exist");
            }

            delete connections[userToRemove];
            console.log(`User deleted ${userToRemove}`);
        });
    });
};
