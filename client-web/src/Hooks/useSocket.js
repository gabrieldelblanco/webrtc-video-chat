import React from "react";
import socketClient from "socket.io-client";

const useSocket = (namespace) => {
  const [socket, setSocket] = React.useState(null);
  React.useEffect(() => {
    if (socket === null) {
      setSocket(socketClient(`/${namespace}`));
    }

    return () => socket && socket.disconnect();
  }, [socket, namespace]);

  return socket;
};

export default useSocket;
