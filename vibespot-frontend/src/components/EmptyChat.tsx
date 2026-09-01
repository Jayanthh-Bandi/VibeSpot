const EmptyChat = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
      <div className="text-6xl">
        💬
      </div>

      <h2 className="mt-4 text-xl font-semibold">
        No messages yet
      </h2>

      <p className="mt-2">
        Say hello and start the conversation.
      </p>
    </div>
  );
};

export default EmptyChat;