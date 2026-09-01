import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

interface PendingVibesDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const PendingVibesDrawer = ({
  open,
  onClose,
  children,
}: PendingVibesDrawerProps) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-bold">
            Incoming Vibes ❤️
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </aside>
    </>
  );
};

export default PendingVibesDrawer;