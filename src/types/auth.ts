export interface User {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token?: string;
  user: User;
  message?: string;
}

export interface ForgotPasswordResponse {
  message?: string;
}

export interface ResetPasswordResponse {
  message?: string;
}