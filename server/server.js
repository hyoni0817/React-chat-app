const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
let i = 0;
let user = [];
io.set("origins", "*:*");
io.on("connection", socket => {
    console.log("Client Successfully Connected");

    let userInfo = {};
    userInfo.socketId = socket.id;
    userInfo.userId = '방랑자' + (++i);
    userInfo.sysmsg = 'entrance';
    user.push(userInfo);

    io.sockets.emit("sysmsg", userInfo); //user정보 보내기

    
    socket.on('chat', msg => { // msgEmit에서 메세지 받기
        var output = {msg : msg.message, date:msg.date, time:msg.time, id : userInfo.userId};
        //나를 제외하고 메세지 전송하기
        socket.broadcast.emit("chat", output)

        //나를 포함해서 메세지 전송하기
        //io.sockets.emit("chat", output); 
    });

    socket.on('disconnect', () => {
        userInfo.sysmsg = 'out';
        io.sockets.emit("sysmsg", userInfo);
    })

});

server.listen(5000, () => {
    console.log("Backend Server is running on http://localhost:5000")
})