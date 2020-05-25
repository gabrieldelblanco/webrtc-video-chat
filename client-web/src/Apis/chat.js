import axios from "axios";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const createRoom = async () => {
  try {
    const room = await axios.post("/chat/room");
    return { success: true, id: room.data.id };
  } catch (error) {
    return { success: false, error: error };
  }
};

const waitConnection = async (room, localStream, remoteStream, socket) => {
  return new Promise((resolve) => {
    socket.on("start", ({ status, isCaller }) => {
      console.log("start received. ", { status, isCaller });

      if (status === "full") {
        resolve({ status: "full" });
      }

      let peerConnection = new RTCPeerConnection(configuration);
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.addEventListener("icecandidate", (event) => {
        if (!event.candidate) {
          //console.log("Got final candidate!");
          return;
        }
        //console.log("Got candidate: ", event.candidate);
        socket.emit("icecandidate", { room, candidate: event.candidate.toJSON() });
      });

      socket.on("icecandidate", (candidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });

      peerConnection.addEventListener("track", (event) => {
        //console.log("Got remote track:", event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
          //console.log("Add a track to the remoteStream:", track);
          remoteStream.addTrack(track);
        });
      });

      if (isCaller) {
        createOffer(room, peerConnection, socket);
      }

      resolve({ status, isCaller, peerConnection });
    });
  });
};

const createOffer = async (room, peerConnection, socket) => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log("Created offer:", offer);

  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  socket.emit("offer", { room, offer: roomWithOffer });
};

export const startCall = async (chatId, localStream, remoteStream, socket) => {
  const room = chatId;
  socket.emit("join", room);

  const { status, isCaller, peerConnection } = await waitConnection(room, localStream, remoteStream, socket);

  if (status === "full") {
    return { success: false, error: "full" };
  }

  socket.on("answer", ({ answer }) => {
    console.log("Got answer:", answer);
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on("offer", async ({ offer }) => {
    console.log("Got offer:", offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log("Created answer:", answer);
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    socket.emit("answer", { room, answer: roomWithAnswer });
  });

  return { success: true };
};
