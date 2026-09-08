import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

import { register } from "../services/authService";

import { validateEmail, validatePassword, validateUsername } from "../utils/validation";



const avatarOptions = [
  "😀",
  "😎",
  "🤖",
  "👻",
  "🐼",
  "🦊",
  "🐱",
  "🐵",
];

const RegisterPage = () => {
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatarEmoji: "😀",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    api: "",
  });

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (usernameError || emailError || passwordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        api: "",
      });

      return;
    }

    setErrors({
      username: "",
      email: "",
      password: "",
      api: "",
    });

    try {
      setLoading(true);
     console.log(formData)
      const response = await register(formData);
   

      console.log(response)
     

      navigate("/login");
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        api:
          error.response?.data?.message ??
          "Registration failed",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-5"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Join VibeSpot today
          </p>
        </div>

        <CustomInput
          label="Username"
          placeholder="Enter username"
          value={formData.username}
          error={errors.username}
          leftIcon={<UserIcon className="h-5 w-5" />}
          onChange={(e) =>
            handleChange("username", e.target.value)
          }
        />

        <CustomInput
          label="Email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          error={errors.email}
          leftIcon={<EnvelopeIcon className="h-5 w-5" />}
          onChange={(e) =>
            handleChange("email", e.target.value)
          }
        />

        <CustomInput
          label="Password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          error={errors.password}
          leftIcon={<LockClosedIcon className="h-5 w-5" />}
          onChange={(e) =>
            handleChange("password", e.target.value)
          }
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Choose Avatar
          </label>

          <div className="grid grid-cols-4 gap-3">
            {avatarOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() =>
                  handleChange("avatarEmoji", emoji)
                }
                className={`rounded-xl border p-3 text-2xl transition ${
                  formData.avatarEmoji === emoji
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {errors.api && (
          <p className="text-sm text-red-500">
            {errors.api}
          </p>
        )}

        <CustomButton
  type="submit"
  loading={loading}
  className="mt-2 py-3 text-lg"
>
  Create Account
</CustomButton>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;