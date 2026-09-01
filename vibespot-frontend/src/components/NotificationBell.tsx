import { BellIcon } from "@heroicons/react/24/outline";

interface NotificationBellProps {
  count: number;
  onClick: () => void;
}

const NotificationBell = ({
  count,
  onClick,
}: NotificationBellProps) => {
  return (
    <button
      onClick={onClick}
      className="relative rounded-full p-2 transition hover:bg-gray-100"
    >
      <BellIcon className="h-7 w-7 text-gray-700" />

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;