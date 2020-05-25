import React from "react";
import VideoWindow from "../../Components/VideoWindow";
import { useParams, useLocation } from "react-router-dom";

import { startCall } from "../../Apis/chat";
import Draggable from "react-draggable";

import useSocket from "../../Hooks/useSocket";
import "./chat.css";

const Chat = () => {
  let { id } = useParams();
  let socket = useSocket("chatio");

  const [status, setStatus] = React.useState("waiting");

  const [localStream, setLocalStream] = React.useState(null);
  const [remoteStream, setRemoteStream] = React.useState(null);
  const [windowStreams, setWindowStreams] = React.useState({ big: null, small: null });

  const [big, setBig] = React.useState("remote");

  React.useEffect(() => {
    let stream = null;
    const openUserMedia = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      setLocalStream(stream);
      let remoteStream = new MediaStream();
      setRemoteStream(remoteStream);
      setWindowStreams({ small: stream, big: remoteStream });
    };

    openUserMedia();

    const closeUserMedia = () => {
      if (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    };

    return closeUserMedia;
  }, []);

  React.useEffect(() => {
    const initRoom = async () => {
      setStatus("Esperando conexión...");
      const result = await startCall(id, localStream, remoteStream, socket);
      if (result.success) {
        setStatus("Conexión exitosa");
      } else {
        if (result.error && result.error === "full") {
          setStatus("Error. No se puede unir a la sesión.");
        } else {
          setStatus("Error de conexión");
        }
      }
    };

    if (localStream !== null && remoteStream !== null && socket !== null) {
      initRoom();
    }
  }, [localStream, remoteStream, socket]);

  const switchVideos = () => {
    //setBig(big === "local" ? "remote" : "local");
    if (windowStreams.big === remoteStream) {
      setWindowStreams({ big: localStream, small: remoteStream });
    } else {
      setWindowStreams({ big: remoteStream, small: localStream });
    }
  };

  const videosDiv = document.getElementById("videos");
  const smallDiv = document.getElementsByClassName("small-video")[0];
  const bounds = {
    top: 0,
    left: 0,
    right: videosDiv && smallDiv ? videosDiv.clientWidth - smallDiv.clientWidth - 100 : 0, //to do: calcular en el video resize y sacar el -100
    bottom: videosDiv && smallDiv ? videosDiv.clientHeight - smallDiv.clientHeight - 200 : 0,
  };
  console.log(bounds);
  //bounds={{ top: 0, left: 0, right: 300, bottom: 300 }}
  return (
    <div className="chat-container">
      <Draggable bounds={bounds}>
        <div className="movable" id="movable-video">
          <VideoWindow stream={windowStreams.small} className="small-video" muted isBig={big === "local"} />
        </div>
        {/* <div
          style={{ position: "absolute", backgroundColor: "green", height: "200px", width: "200px", zIndex: 999 }}
        ></div> */}
      </Draggable>
      <div id="videos" className="videos" onClick={switchVideos}>
        <VideoWindow stream={windowStreams.big} muted className="big-video" isBig={big === "remote"} />
        <div className="status">
          <p>{status}</p>
        </div>
      </div>
      <div className="toolbar"></div>
    </div>
  );
};

export default Chat;
