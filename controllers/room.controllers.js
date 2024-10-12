const uuidv4 = require("uuid").v4;

function createRoom(req, res) {
    const { admin, vedio } = req.body;
    const user = uuidv4();
    const roomId = uuidv4();

    return res.status(201).json({
        roomId,
        admin: {
            id: user,
            vedio,
            name: admin,
        },
    });
}

module.exports = { createRoom };
