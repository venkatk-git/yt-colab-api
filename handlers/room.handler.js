const uuidv4 = require("uuid").v4;

function joinRoom(roomId, user, socket, connections, rooms) {
    const uuid = uuidv4();

    connections[uuid] = {
        username: user,
        socket,
        roomId,
    };

    rooms[roomId] = {
        ...rooms[roomId],
        members: [...rooms[roomId]?.members, uuid],
    };

    console.log(`${uuid} connected`);

    console.log({ connections });
    console.log(rooms);

    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { user });
}

function createRoom(roomId, admin, socket, connections, rooms) {
    const { id, name, vedio } = admin;
    connections[admin.id] = {
        username: name,
        socket,
        roomId,
    };

    rooms[roomId] = {
        admin: id,
        members: [id],
        vedio: vedio,
    };

    console.log(`${id} connected`);

    console.log({ connections });
    console.log(rooms);

    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { name });
}

module.exports = { joinRoom, createRoom };
