import api from "../api/axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UpdateProfileRequest,
  User,
} from "../types/auth";

export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<{ success: boolean; message: string; user: User }> => {
  const response = await api.patch("/auth/profile", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<{ success: boolean; user: User }> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);

  return response.data;
};