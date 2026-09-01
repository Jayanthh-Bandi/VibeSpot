import CustomButton from "./CustomButton";

interface Props {
  open: boolean;

  username: string;

  avatar: string;

  onStartChat: () => void;

  onClose: () => void;
}

const MatchModal = ({
  open,
  username,
  avatar,
  onStartChat,
  onClose,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">

          <div className="text-7xl">
            🎉
          </div>

          <h2 className="mt-4 text-3xl font-bold">
            It's a Match!
          </h2>

          <div className="mt-6 text-6xl">
            {avatar}
          </div>

          <h3 className="mt-3 text-xl font-semibold">
            {username}
          </h3>

          <p className="mt-2 text-gray-500">
            You both sent vibes to each other.
          </p>

          <div className="mt-8 space-y-3">

            <CustomButton
              onClick={onStartChat}
            >
              Start Chat
            </CustomButton>

            <CustomButton
             
              onClick={onClose}
            >
              Later
            </CustomButton>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;