const {
    joinRoomHandler,
    createRoomHandler,
    disconnectHandler,
} = require("./handlers/room.handler");

module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("room:create", ({ roomId, adminName, vedio }) => {
            createRoomHandler(roomId, adminName, vedio, socket);
        });

        socket.on("room:join", ({ roomId, user }) => {
            joinRoomHandler(roomId, user, socket);
        });

        socket.on("disconnect", () => {
            disconnectHandler(socket);
        });
    });
};
