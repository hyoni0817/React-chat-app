import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000");

//메세지 받기
function msgOn(cb) { 
    socket.on('chat', message => {
        cb(message);
    });
}

//메세지 보내기
function msgEmit(msg) {
    socket.emit('chat', msg);
}

export {msgOn, msgEmit};