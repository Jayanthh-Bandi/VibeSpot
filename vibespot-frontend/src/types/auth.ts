export interface User {
  id: string;
  username: string;
  email: string;
  avatarEmoji: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  avatarEmoji: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
  };
}

export interface UpdateProfileRequest {
  username?: string;
  avatarEmoji?: string;
  password?: string;
}