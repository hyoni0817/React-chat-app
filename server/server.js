const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.set("origins", "*:*");
io.on("connection", socket => {
    console.log("Client Successfully Connected");
    socket.on('chat', msg => { // msgEmit에서 메세지 받기
        io.sockets.emit("chat", msg); 
    })
})

server.listen(5000, () => {
    console.log("Backend Server is running on http://localhost:5000")
})