"use client";

import { SessionProvider } from "next-auth/react";
import { useClinicContext } from "@/context/clinicContext";
import { useEffect, useState } from "react";
import io from "socket.io-client";


export const AuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://socket-server-liard.vercel.app");

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    // Additional event listeners and configurations can be added here for future Upgrades ~ Usman Ahmed :)

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);


  return (<SessionProvider>
    <useClinicContext.Provider value={{ socket: socket }}>
      {children}
    </useClinicContext.Provider>
  </SessionProvider>);
};
