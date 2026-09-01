import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Socket } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { connectSocket } from "../services/socketService";
import type { PendingVibe } from "../types/vibe";
import type { MatchNotification } from "../types/match";

interface SocketContextType {
  socket: Socket | null;

  incomingVibes: PendingVibe[];

  unreadCount: number;

  activeMatch: MatchNotification | null;

  clearUnread: () => void;

  addPendingVibes: (vibes: PendingVibe[]) => void;

  showMatch: (match: MatchNotification) => void;

  clearMatch: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
const { token } = useAuth();
  const [incomingVibes, setIncomingVibes] = useState<PendingVibe[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [activeMatch, setActiveMatch] =
    useState<MatchNotification | null>(null);

  const addPendingVibes = (vibes: PendingVibe[]) => {
    setIncomingVibes((previous) => {
      const existingIds = new Set(previous.map((v) => v.id));

      const newItems = vibes.filter(
        (v) => !existingIds.has(v.id)
      );

      return [...newItems, ...previous];
    });
  };

  const clearUnread = () => {
    setUnreadCount(0);
  };

  const showMatch = (match: MatchNotification) => {
    setActiveMatch(match);
  };

  const clearMatch = () => {
    setActiveMatch(null);
  };
   
  useEffect(() => {
  if (!token) {
    return;
  }

  const currentSocket = connectSocket(token);

  setSocket(currentSocket);

  const handleIncomingVibe = (data: PendingVibe) => {
    console.log("Incoming vibe", data);

    addPendingVibes([data]);
    setUnreadCount((prev) => prev + 1);
  };

  const handleMatchCreated = (data: MatchNotification) => {
    console.log("🎉 MATCH EVENT RECEIVED", data);

    showMatch(data);
  };

  currentSocket.on("incoming_vibe", handleIncomingVibe);
  currentSocket.on("match_created", handleMatchCreated);

  return () => {
    currentSocket.off("incoming_vibe", handleIncomingVibe);
    currentSocket.off("match_created", handleMatchCreated);
  };
}, [token]);

  const value = useMemo(
    () => ({
      socket,
      incomingVibes,
      unreadCount,
      activeMatch,
      clearUnread,
      addPendingVibes,
      showMatch,
      clearMatch,
    }),
    [
      socket,
      incomingVibes,
      unreadCount,
      activeMatch,
    ]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used inside SocketProvider"
    );
  }

  return context;
}