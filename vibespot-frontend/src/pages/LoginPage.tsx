import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

import { login as loginService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import {
  validateEmail,
  validatePassword,
} from "../utils/validation";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const emailError = validateEmail(email);

    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        api: "",
      });

      return;
    }

    setErrors({
      email: "",
      password: "",
      api: "",
    });

    try {
      setLoading(true);

      const response = await loginService({
        email,
        password,
      });
      console.log("Login Response:", response);
   

     login(
  response.data.token,
  response.data.user
          );

      navigate("/");
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        api:
          error.response?.data?.message ??
          "Login failed",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-lg p-8 shadow-2xl border border-violet-100 space-y-5"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-gray-600 mt-2 font-medium">
            Login to continue your journey
          </p>
        </div>

        <CustomInput
          label="Email"
          type="email"
          value={email}
          error={errors.email}
          placeholder="Enter email"
          leftIcon={
            <EnvelopeIcon className="h-5 w-5" />
          }
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <CustomInput
          label="Password"
          type="password"
          value={password}
          error={errors.password}
          placeholder="Enter password"
          leftIcon={
            <LockClosedIcon className="h-5 w-5" />
          }
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {errors.api && (
          <p className="text-sm text-red-500">
            {errors.api}
          </p>
        )}

        <CustomButton
  type="submit"
  loading={loading}
  className="mt-2 py-3 text-lg bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200"
>
  Sign In
</CustomButton>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;