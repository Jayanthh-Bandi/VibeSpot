import { useAuth } from "../context/AuthContext";
import type { Message } from "../types/message";

interface Props {
  message: Message;
}

const MessageBubble = ({ message }: Props) => {
  const { user } = useAuth();
  const isMine = message.senderId === user?.id;

  return (
    <div
      className={`flex mb-4 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow ${
          isMine
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-900 rounded-bl-md"
        }`}
      >
        <p className="break-words whitespace-pre-wrap">
          {message.content}
        </p>

        <p
          className={`mt-2 text-right text-[10px] ${
            isMine
              ? "text-blue-100"
              : "text-gray-400"
          }`}
        >
          {new Date(message.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
