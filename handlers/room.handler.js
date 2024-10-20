const db = require("../services/firebase");
const roomRef = db.ref("rooms");
const connectionsRef = db.ref("connections");

function createRoomHandler(roomId, adminName, vedio, socket) {
    const adminId = socket.id;

    if (!adminName) {
        console.error("Admin name is required but was not provided");
        return;
    }

    connectionsRef.child(adminId).set({
        name: adminName,
        roomId,
    });

    roomRef.child(roomId).set({
        admin: adminId,
        members: [adminId],
        vedio: vedio,
        status: "active",
    });

    console.log(`${adminId} connected`);

    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { adminName });
}

function joinRoomHandler(roomId, userName, socket) {
    const userId = socket.id;

    const userRef = db.ref(`rooms/${roomId}/members`);
    userRef.push(userId);

    connectionsRef.child(userId).set({
        name: userName,
        roomId,
    });

    console.log(`${userId} connected`);

    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { userName });
}

function disconnectHandler(socket) {
    const socketId = socket.id;

    connectionsRef.child(socketId).once("value", (snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const roomId = userData.roomId;

            connectionsRef
                .child(socketId)
                .remove()
                .then(() => {
                    console.log(
                        `Connection with socket ID: ${socketId} has been removed.`
                    );
                })
                .catch((error) => {
                    console.error(
                        `Error removing connection with socket ID: ${socketId}`,
                        error
                    );
                });

            if (roomId) {
                roomRef.child(roomId).once("value", (roomSnapshot) => {
                    if (roomSnapshot.exists()) {
                        const roomData = roomSnapshot.val();
                        const members = roomData.members || [];

                        // Remove the user from the members list
                        const updatedMembers = members.filter(
                            (memberId) => memberId !== socketId
                        );

                        roomRef
                            .child(roomId)
                            .update({ members: updatedMembers })
                            .then(() => {
                                if (updatedMembers.length === 0) {
                                    return roomRef
                                        .child(roomId)
                                        .remove()
                                        .then(() => {
                                            console.log(
                                                `Room with ID: ${roomId} has been removed.`
                                            );
                                        });
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    `Error updating members in room with ID: ${roomId}`,
                                    error
                                );
                            });
                    }
                });
            }
        } else {
            console.log(`No connection found for socket ID: ${socketId}`);
        }
    });
}

module.exports = { joinRoomHandler, createRoomHandler, disconnectHandler };
