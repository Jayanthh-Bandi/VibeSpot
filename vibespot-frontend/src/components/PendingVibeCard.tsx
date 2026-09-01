interface PendingVibeCardProps {
  username: string;
  avatarEmoji: string;
  emoji: string;
  createdAt: string;
}

const PendingVibeCard = ({
  username,
  avatarEmoji,
  emoji,
  createdAt,
}: PendingVibeCardProps) => {
  return (
    <div className="border-b p-5 transition hover:bg-slate-50">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-3xl">
          {avatarEmoji}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg">
            {username}
          </h3>

          <p className="mt-1 text-gray-600">
            sent you a{" "}
            <span className="text-xl">{emoji}</span> vibe
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingVibeCard;