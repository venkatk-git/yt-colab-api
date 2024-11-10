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

        socket.on("play", ({ roomId, currentTime }) => {
            console.log(currentTime);
            socket.to(roomId).emit("play", { currentTime });
        });

        socket.on("pause", ({ roomId, currentTime }) => {
            socket.to(roomId).emit("pause", { currentTime });
        });

        socket.on("seek", ({ roomId, time }) => {
            socket.to(roomId).emit("seek", { time });
        });

        socket.on("disconnect", () => {
            disconnectHandler(socket);
        });
    });
};
