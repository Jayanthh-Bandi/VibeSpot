import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ChatHeader from "../components/ChatHeader";
import EmptyChat from "../components/EmptyChat";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

import { getMessages } from "../services/messageService";
import { useSocket } from "../hooks/SocketContext";
import { useAuth } from "../context/AuthContext";

import type { Message } from "../types/message";

const ChatPage = () => {
  const { matchId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !matchId) return;

    socket.emit("join_match", { matchId });

    const onMatchJoined = () => {
      console.log("Joined room");
    };

    const onUserTyping = (data: { email: string }) => {
      if (data.email !== user?.email) {
        setIsTyping(true);
      }
    };

    const onUserStoppedTyping = () => {
      setIsTyping(false);
    };

    const onReceiveMessage = (message: Message) => {
      setMessages((previous) => {
        if (previous.some((m) => m.id === message.id)) {
          return previous;
        }
        return [...previous, message];
      });
    };

    const onChatError = (error: { message: string }) => {
      toast.error(error.message || "Something went wrong");
    };

    socket.on("match_joined", onMatchJoined);
    socket.on("user_typing", onUserTyping);
    socket.on("user_stopped_typing", onUserStoppedTyping);
    socket.on("receive_message", onReceiveMessage);
    socket.on("chat_error", onChatError);

    return () => {
      socket.off("match_joined", onMatchJoined);
      socket.off("user_typing", onUserTyping);
      socket.off("user_stopped_typing", onUserStoppedTyping);
      socket.off("receive_message", onReceiveMessage);
      socket.off("chat_error", onChatError);
    };
  }, [socket, matchId, user?.email]);

  useEffect(() => {
    if (!matchId) return;

    const loadMessages = async () => {
      try {
        const response = await getMessages(matchId);
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
  }, [messages, isTyping]);

  const handleSend = (message: string) => {
    if (!socket) return;
    socket.emit("send_message", { message });
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

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        {messages.length === 0 && !isTyping ? (
          <EmptyChat />
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}

            {isTyping && (
              <div className="flex justify-start px-1 pb-2">
                <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 shadow">
                  <div className="flex items-center gap-1.5">
                    <span className="flex gap-1">
                      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                      <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                    </span>
                    <span className="text-xs text-gray-500">
                      Someone is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatPage;
