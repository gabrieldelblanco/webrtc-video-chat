import React from "react";

const VideoWindow = ({ stream, muted, className, isBig }) => {
  const windowRef = React.useRef(null);

  React.useEffect(() => {
    if (stream !== null) {
      windowRef.current.srcObject = stream;
    }

    const cleanup = () => {
      windowRef.current.srcObject = null;
    };

    return cleanup;
  }, [stream]);

  return (
    <video
      className={`videowindow ${className} ${isBig ? "big" : "small"}`}
      muted={muted}
      autoPlay
      playsInline
      ref={windowRef}
    ></video>
  );
};

export default VideoWindow;
