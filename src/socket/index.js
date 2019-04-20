import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000");

//메세지 받기
function msgOn(cb) { 
    socket.on('chat', data => {
        cb(data);
    });
}

//유저 정보 전달
function userView(cb) {
    socket.on('sysmsg', message => {
        let date = new Date();
        let msgDate = date.getFullYear() + "년 " + (date.getMonth()+1) + "월 " + date.getDate() + "일";
        const output = {userId : message.userId, date :  msgDate, time : 'N', sysmsg: message.sysmsg}
        cb(output);
   
    })
}
//메세지 보내기
function msgEmit(msg) {
    socket.emit('chat', msg);
}

export {msgOn, msgEmit, userView};