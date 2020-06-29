import React from "react";
import VideoWindow from "../../Components/VideoWindow";
import { useParams, useHistory } from "react-router-dom";

import { startCall, endCall, toggleMute } from "../../Apis/chat";
import Draggable from "react-draggable";

import useSocket from "../../Hooks/useSocket";
import ChatToolbar from "../../Components/ChatToolbar/ChatToolbar";
import "./chat.css";

const Chat = () => {
  let { id } = useParams();
  let socket = useSocket("chatio");
  let history = useHistory();

  const [status, setStatus] = React.useState("waiting");

  const [localStream, setLocalStream] = React.useState(null);
  const [remoteStream, setRemoteStream] = React.useState(null);
  const [windowStreams, setWindowStreams] = React.useState({ big: null, small: null });

  const [peerConnection, setPeerConnection] = React.useState(null);
  const [isMuted, setIsMuted] = React.useState(false);

  const draggableRef = React.useRef(null);

  const onEndCall = () => {
    history.push("/");
  };

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
      setStatus("Waiting for conection...");
      const events = { onEndCall: onEndCall };
      const result = await startCall(id, localStream, remoteStream, socket, events);
      if (result.success) {
        setStatus("Connected!");
        setPeerConnection(result.peerConnection);
      } else {
        if (result.error && result.error === "full") {
          setStatus("Error. Room is full.");
        } else {
          setStatus("Connection error");
        }
      }
    };

    if (localStream !== null && remoteStream !== null && socket !== null) {
      initRoom();
    }
  }, [localStream, remoteStream, socket]);

  const switchVideos = () => {
    if (windowStreams.big === remoteStream) {
      setWindowStreams({ big: localStream, small: remoteStream });
    } else {
      setWindowStreams({ big: remoteStream, small: localStream });
    }
  };

  const onToolbarClick = (e) => {
    switch (e.tool) {
      case "endCall":
        endCall(id, socket);
        onEndCall();
        break;
      case "mute":
        setIsMuted(toggleMute(peerConnection));
        break;
    }
  };

  return (
    <div className="chat-container">
      <Draggable nodeRef={draggableRef}>
        <div className="movable" id="movable-video" ref={draggableRef}>
          <VideoWindow
            stream={windowStreams.small}
            className="small-video"
            muted={windowStreams.small === localStream}
            isBig={false}
          />
        </div>
      </Draggable>
      <div id="videos" className="videos" onClick={switchVideos}>
        <VideoWindow
          stream={windowStreams.big}
          muted={windowStreams.big === localStream}
          className="big-video"
          isBig={true}
        />
        <div className="status">
          <p>{status}</p>
        </div>
      </div>
      <div className="toolbar">
        <ChatToolbar onClick={onToolbarClick} isMuted={isMuted} />
      </div>
    </div>
  );
};

export default Chat;
