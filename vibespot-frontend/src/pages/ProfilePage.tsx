import { useState } from "react";
import axios from "axios";
import {
  CheckIcon,
  LockClosedIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";

const avatarOptions = ["😀", "😎", "🤖", "👻", "🐼", "🦊", "🐱", "🐵"];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username ?? "");
  const [avatarEmoji, setAvatarEmoji] = useState(user?.avatarEmoji ?? "😀");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await updateProfile({
        username,
        avatarEmoji,
        ...(password ? { password } : {}),
      });
      updateUser(response.user);
      setPassword("");
      setEditing(false);
      setMessage("Your profile has been updated.");
    } catch (requestError: unknown) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message ?? "Unable to update your profile."
          : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(user?.username ?? "");
    setAvatarEmoji(user?.avatarEmoji ?? "😀");
    setPassword("");
    setError("");
    setEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Profile" showBackButton />

      <main className="mx-auto max-w-2xl px-6 pb-10">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white sm:px-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Your account</p>
                <h1 className="mt-1 text-2xl font-bold">Personal profile</h1>
              </div>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit profile
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="-mt-20 mb-8 flex items-end gap-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-white bg-slate-100 text-6xl shadow-md">
                {avatarEmoji}
              </div>
              <div className="pb-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.username || "VibeSpot member"}
                </h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-5">
                <CustomInput
                  label="Name"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  leftIcon={<UserCircleIcon className="h-5 w-5" />}
                />

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Choose your avatar
                  </p>
                  <div className="grid grid-cols-8 gap-2">
                    {avatarOptions.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setAvatarEmoji(emoji)}
                        className={`rounded-xl p-2 text-2xl ${
                          avatarEmoji === emoji
                            ? "bg-blue-100 ring-2 ring-blue-500"
                            : "bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <CustomInput
                  label="Email address"
                  value={user?.email ?? ""}
                  disabled
                  type="email"
                />

                <CustomInput
                  label="New password"
                  type="password"
                  value={password}
                  placeholder="Leave blank to keep your password"
                  leftIcon={<LockClosedIcon className="h-5 w-5" />}
                  onChange={(event) => setPassword(event.target.value)}
                />

                {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                <div className="flex gap-3">
                  <CustomButton loading={saving} onClick={handleSave} className="flex-1">
                    <CheckIcon className="mr-2 inline h-5 w-5" />
                    Save changes
                  </CustomButton>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-2xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
                  <p className="mt-1 font-medium text-slate-900">{user?.username}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                  <p className="mt-1 font-medium text-slate-900">{user?.email}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Password</p>
                  <p className="mt-1 font-medium tracking-widest text-slate-900">********</p>
                </div>
                {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}
              </div>
            )}

            <div className="mt-8 border-t border-slate-100 pt-6">
              <CustomButton variant="danger" onClick={handleLogout} className="py-3">
                Logout
              </CustomButton>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default ProfilePage;
