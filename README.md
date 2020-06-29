# webrtc-video-chat
Video Chat Application using WebRTC, Node JS and React JS.  

This is just a sample webrtc video chat prototype, with the following architecture:

* the backend is implemented in Node JS, 
* communication with clients is mainly done through [socket.io](https://github.com/socketio/socket.io) 
* the client (frontend) is implemented in ReactJS. Backend and Frontend can run in completely different servers (if needed)

## Demo
[gdb-video-chat](https://gdb-video-chat.herokuapp.com/)

## Quick Start
* You need to have Node.js installed
* Clone this repo
`git clone https://github.com/gabrieldelblanco/webrtc-video-chat/`
`cd webrtc-video-chat`
* Install dependencies 
`npm install`
`cd client-web && npm install && cd ..`
* Run the server 
`npm run server`
* Start web client
`cd client-web && npm start`
* Open `localhost:3000` in your browser

