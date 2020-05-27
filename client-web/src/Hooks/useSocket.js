import React from "react";
import socketClient from "socket.io-client";

const useSocket = (namespace) => {
  const [socket, setSocket] = React.useState(null);
  React.useEffect(() => {
    setSocket(socketClient(`/${namespace}`));
  }, [namespace]);

  return socket;
};

export default useSocket;
