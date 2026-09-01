import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import ChatHeader from "../components/ChatHeader";
import EmptyChat from "../components/EmptyChat";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

import { getMessages } from "../services/messageService";

import { useSocket } from "../hooks/SocketContext";

import type { Message } from "../types/message";

const ChatPage = () => {
  const { matchId } = useParams();

  const { socket } = useSocket();

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !matchId) return;

    console.log(
      "Emitting join_match:",
      matchId
    );

    socket.emit("join_match", {
      matchId,
    });

    socket.on("match_joined", () => {
      console.log("✅ Joined room");
    });



    socket.on("user_typing", () => {
  setIsTyping(true);
   });

    socket.on("user_stopped_typing", () => {
  setIsTyping(false);
   });


       socket.on("receive_message", (message) => {
   console.log("📨 receive_message fired");
  console.log(message);

  setMessages((previous) => [
    ...previous,
    message,
   ]);
   });

    socket.on("chat_error", (error) => {
      console.log("❌", error);
    });

    return () => {
  socket.off("match_joined");
  socket.off("receive_message");
  socket.off("chat_error");
  socket.off("user_typing");
  socket.off("user_stopped_typing");
};
  }, [socket, matchId]);

  useEffect(() => {
    if (!matchId) return;

    const loadMessages = async () => {
      try {
        const response =
          await getMessages(matchId);

        setMessages(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

    const handleSend = (message: string) => {
  if (!socket) return;

  socket.emit("send_message", {
    message,
  });
};
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <EmptyChat />
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
      />
    </div>
  );
};

export default ChatPage;