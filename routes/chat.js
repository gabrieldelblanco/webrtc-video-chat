const express = require("express");
const token = require("../utils/token");
var chalkLog = require("chalk-log");

const router = express.Router();

router.post("/room", async (req, res) => {
  const id = await token(12);
  //todo: validate that there are no rooms with this name

  res.json({ id });
});

const log = (msg, room) => {
  if (room) {
    chalkLog.ok(room + ": " + msg);
  } else {
    chalkLog.log(msg);
  }
};

const NAMESPACE = "/chatio";

module.exports = function (io) {
  io.of(NAMESPACE).on("connection", function (socket) {
    log("/chatio connection");

    socket.on("join", (room) => {
      log("join", room);

      var clients = io.nsps[NAMESPACE].adapter.rooms[room];
      var numberOfRoomMembers = typeof clients !== "undefined" ? clients.length : 0;

      log(`Number of members: ${numberOfRoomMembers}`, room);

      if (numberOfRoomMembers < 2) {
        socket.join(room);
      }

      if (numberOfRoomMembers === 1) {
        log("start", room);

        socket.broadcast.to(room).emit("start", { isCaller: true });
        socket.emit("start", { isCaller: false });
      } else if (numberOfRoomMembers > 1) {
        socket.emit("start", { status: "full" });
      }
    });

    socket.on("icecandidate", ({ room, candidate }) => {
      socket.broadcast.to(room).emit("icecandidate", candidate);
    });

    socket.on("offer", ({ offer, room }) => {
      log("offer", room);
      socket.broadcast.to(room).emit("offer", offer);
    });

    socket.on("answer", ({ answer, room }) => {
      log("answer", room);
      socket.broadcast.to(room).emit("answer", answer);
    });
  });
  return router;
};
