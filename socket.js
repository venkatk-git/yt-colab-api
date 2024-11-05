const {
    joinRoomHandler,
    createRoomHandler,
    disconnectHandler,
} = require("./handlers/room.handler");

module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("room:create", ({ roomId, adminName, video }) => {
            createRoomHandler(roomId, adminName, video, socket);
        });

        socket.on("room:join", ({ roomId, user }) => {
            joinRoomHandler(roomId, user, socket);
        });

        socket.on("disconnect", () => {
            disconnectHandler(socket);
        });
    });
};
