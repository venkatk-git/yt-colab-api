const db = require("../services/firebase");
const roomRef = db.ref("rooms");
const connectionsRef = db.ref("connections");

const uuidv4 = require("uuid").v4;

function createRoom(req, res) {
    const { admin, vedio } = req.body;

    return res.status(201).json({
        roomId,
        admin: {
            id: adminId,
            vedio,
            name: admin,
        },
    });
}

function disconnectRoom(roomId) {
    if (!roomRef.child(roomId)) {
        return null;
    }

    roomRef.child(roomId).remove();
}

module.exports = { createRoom };
