import { useEffect, useRef, useState } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const emitTypingStart = () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket?.emit("typing_start");
    }
  };

  const emitTypingStop = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket?.emit("typing_stop");
    }
  };

  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current !== null) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const resetTypingTimeout = () => {
    clearTypingTimeout();
    typingTimeoutRef.current = setTimeout(() => {
      emitTypingStop();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTypingTimeout();
      if (isTypingRef.current) {
        socket?.emit("typing_stop");
        isTypingRef.current = false;
      }
    };
  }, [socket]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setMessage(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }

    if (value.trim()) {
      emitTypingStart();
      resetTypingTimeout();
    } else {
      clearTypingTimeout();
      emitTypingStop();
    }
  };

  const handleSend = async () => {
    const text = message.trim();
    if (!text || sending || disabled) return;

    try {
      setSending(true);
      clearTypingTimeout();
      emitTypingStop();
      await onSend(text);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 border-t bg-white p-3 sm:p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-2 sm:gap-3">
        <textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={message}
          disabled={disabled || sending}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="min-h-[44px] max-h-[120px] flex-1 resize-none overflow-y-auto rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />

        <button
          onClick={handleSend}
          disabled={
            disabled ||
            sending ||
            message.trim() === ""
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:w-12"
        >
          <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
