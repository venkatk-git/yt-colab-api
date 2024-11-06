const db = require("../services/firebase");
const roomRef = db.ref("rooms");
const connectionsRef = db.ref("connections");

function createRoomHandler(roomId, adminName, video, socket) {
    const adminId = socket.id;

    if (!adminName) {
        console.error("Admin name is required but was not provided");
        return;
    }

    connectionsRef.child(adminId).set({
        name: adminName,
        roomId,
    });

    console.log("Video Id: " + video);

    roomRef.child(roomId).set({
        admin: adminId,
        members: [adminId],
        video,
        status: "active",
    });

    console.log(`${adminId} connected`);

    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { adminName });
}

async function joinRoomHandler(roomId, userName, socket) {
    const userId = socket.id;

    // Access room reference without redefining roomRef
    const specificRoomRef = db.ref(`rooms/${roomId}`);

    // Add user to room members in Firebase
    const userRef = specificRoomRef.child("members");
    userRef.push(userId);

    connectionsRef.child(userId).set({
        name: userName,
        roomId,
    });

    // Join the socket room
    socket.join(roomId);

    specificRoomRef.once("value", (snapshot) => {
        const roomData = snapshot.val();

        if (roomData) {
            console.log(roomData); // Check data format

            // Emit room data to the joining user, including videoId
            socket.emit("room:data", {
                videoId: roomData.video, // Ensure 'video' is the correct key used in createRoomHandler
                members: roomData.members,
            });
        } else {
            console.error(`Room data for roomId ${roomId} not found.`);
        }
    });

    // Notify other users in the room that a new user has joined
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
                        let members = roomData.members || [];

                        // Check if `members` is an object and convert to an array
                        if (
                            typeof members === "object" &&
                            !Array.isArray(members)
                        ) {
                            members = Object.values(members);
                        }

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
