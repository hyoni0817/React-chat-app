<h1 align="center">💬React Web Chat</h1>
<p align="center">
  React Web Chat는 누구나 참여해서 대화를 나눌 수 있는 간단한 실시간 채팅 웹 애플리케이션 입니다.
</p>
<p align="center">
  <img src="https://img.shields.io/badge/node.js-12.18.3-green?style=flat-square"></img>
  <img src="https://img.shields.io/badge/react-16.8.5-blue?style=flat-square"></img>
  <img src="https://img.shields.io/badge/socket.io-2.2.0-orange?style=flat-square"></img>
</p>

<!-- GIF 추가하기 -->

## 기능
👏 방랑자1, 방랑자2와 같은 닉네임으로 참여하여 대화를 나눌 수 있습니다.   
☄ 현재는 URL에 접속하는 사람이라면 누구나 대화를 나눌 수 있도록 되어있습니다.    

**<p align="center">🚀 이외에도 다양한 기능을 추가 및 개선할 예정입니다 🚀</p>**


## 설치 방법
1. 아래 명령어들을 차례대로 실행해주세요.
    ```
    git clone https://github.com/hyoni0817/React-chat-app.git
    cd React-chat-app && npm install
    
    // 개발 모드로 진행할 경우
    npm run start
    
    // 배포 모드로 진행할 경우
    npm run build
    npx serve -s build
    ```
2. 마지막으로 서버에 웹 소켓을 연결하기 위해 React-chat-app 폴더 위치에서 터미널을 하나 더 추가합니다.   
   그리고 server.js 파일도 함께 실행시켜줍니다.
    ```
    cd server && node server.js
    ```
3.  **개발 모드**는 <http://localhost:3000>으로, **배포 모드**는 <http://localhost:5000>으로 접속하면 결과를 확인하실 수 있습니다.
