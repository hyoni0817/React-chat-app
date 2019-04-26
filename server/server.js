const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
let i = 0;
let user = [];
let date = new Date();
let msgDate = date.getFullYear() + "년 " + (date.getMonth()+1) + "월 " + date.getDate() + "일";
let prevDate = msgDate; 
io.set("origins", "*:*");
io.on("connection", socket => {
    console.log("Client Successfully Connected");

    let userInfo = {}, dateInfo = {};
    userInfo.socketId = socket.id;
    userInfo.userId = '방랑자' + (++i);
    userInfo.sysmsg = 'entrance';
    userInfo.msgDate = msgDate;  
    user.push(userInfo);

    if(prevDate != userInfo.msgDate){
        dateInfo = {date:userInfo.msgDate, time:'N', sysmsg:'todayDate'}
        io.sockets.emit("chat",dateInfo)
    } 
    io.sockets.emit("sysmsg", userInfo); //user정보 보내기
    prevDate = msgDate;
    
    socket.on('chat', msg => { // msgEmit에서 메세지 받기
        var output = (msg.time !== 'N' ? {msg : msg.message, date:msg.date, time:msg.time, id : userInfo.userId}:msg)
        //var output = {msg : msg.message, date:msg.date, time:msg.time, id : userInfo.userId};
        //나를 제외하고 메세지 전송하기
        
        socket.broadcast.emit("chat", output)
        prevDate = msg.date;

        //나를 포함해서 메세지 전송하기
        //io.sockets.emit("chat", output); 
    });
 
    socket.on('disconnect', () => {
        userInfo.sysmsg = 'out';
        userInfo.msgDate = msgDate;
        if(prevDate != userInfo.msgDate){
            dateInfo = {date:userInfo.msgDate, time:'N', sysmsg:'todayDate'}
            io.sockets.emit("chat",dateInfo)
        }
        
        io.sockets.emit("sysmsg", userInfo);
        prevDate = msgDate;
    })

});

server.listen(5000, () => {
    console.log("Backend Server is running on http://localhost:5000")
})