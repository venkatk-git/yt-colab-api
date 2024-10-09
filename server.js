const app = require("./app");
const http = require("http");

const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);

const uuidv4 = require("uuid").v4;

const { PORT } = require("./config/variables");

const connections = {};
const users = {};

io.on("connection", (socket) => {
    const uuid = uuidv4();
    connections[uuid] = socket;

    console.log(connections);
});

httpServer.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});
