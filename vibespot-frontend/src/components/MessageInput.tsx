import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useSocket } from "../hooks/SocketContext";
interface MessageInputProps {
  onSend: (message: string) => Promise<void> | void;
  disabled?: boolean;
}

const MessageInput = ({
  onSend,
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { socket } = useSocket();
  const handleSend = async () => {
    const text = message.trim();

    if (!text || sending || disabled) return;

    try {
      setSending(true);

      await onSend(text);

      setMessage("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      await handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 border-t bg-white p-4">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          disabled={disabled || sending}
          onChange={(e) => {
         setMessage(e.target.value);

         socket?.emit("typing_start");
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-full border border-slate-300 px-5 py-3 outline-none transition focus:border-blue-500"
        />

        <button
          onClick={handleSend}
          disabled={
            disabled ||
            sending ||
            message.trim() === ""
          }
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;