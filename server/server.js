const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

//한국 시간으로 설정하기
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

let i = 0;
let user = [];

let prevDate = moment().year() + "년 " + (moment().month()+1) + "월 " + moment().date() + "일";
// let date1 = new Date();
// let prevDate = date1.getFullYear() + "년 " + (date1.getMonth()+1) + "월 " + date1.getDate() + "일"; 

io.set("origins", "*:*");
io.on("connection", socket => {
    console.log("Client Successfully Connected");
    
    let connectionDt = moment().year() + "년 " + (moment().month()+1) + "월 " + moment().date() + "일";
    // let date2 = new Date();
    // let connectionDt = date2.getFullYear() + "년 " + (date2.getMonth()+1) + "월 " + date2.getDate() + "일";

    let userInfo = {}, dateInfo = {};
    userInfo.socketId = socket.id;
    userInfo.userId = '방랑자' + (++i);
    userInfo.sysmsg = 'entrance';
    userInfo.date = connectionDt;  
    user.push(userInfo);

    if(prevDate !== userInfo.date){
        dateInfo = {date:userInfo.date, time:'N', sysmsg:'todayDate'}
        socket.broadcast.emit("chat",dateInfo)
    } 

    io.sockets.emit("sysmsg", userInfo); //user정보 보내기
    prevDate = userInfo.date;

    socket.on('chat', msg => { // msgEmit에서 메세지 받기
        var output = (msg.time !== 'N' ? {msg : msg.message, date:msg.date, time:msg.time, id : userInfo.userId}:msg)
        //var output = {msg : msg.message, date:msg.date, time:msg.time, id : userInfo.userId};
        //나를 제외하고 메세지 전송하기
        let date2 = new Date();
        socket.broadcast.emit("chat", output)
        prevDate = msg.date;
        //나를 포함해서 메세지 전송하기
        //io.sockets.emit("chat", output); 
    });
 
    socket.on('disconnect', () => {
        let disconnectDt = moment().year() + "년 " + (moment().month()+1) + "월 " + moment().date() + "일";
        // let date3 = new Date();
        // let disconnectDt = date3.getFullYear() + "년 " + (date3.getMonth()+1) + "월 " + date3.getDate() + "일";
        userInfo.sysmsg = 'out';
        userInfo.date = disconnectDt;

        if(prevDate !== userInfo.date){
            dateInfo = {date:userInfo.date, time:'N', sysmsg:'todayDate'}
            io.sockets.emit("chat",dateInfo)
        }

        user.push(userInfo);

        io.sockets.emit("sysmsg", userInfo);
        prevDate = userInfo.date;

    })

});

server.listen(6000, () => {
    console.log("Backend Server is running on http://localhost:6000")
})