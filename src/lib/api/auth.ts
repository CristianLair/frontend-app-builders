import { http } from "@/lib/api/client";
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  User,
} from "@/types/auth";

export const authApi = {
  register(payload: RegisterPayload) {
    return http.post<RegisterResponse>("/api/register", payload);
  },
  login(payload: LoginPayload) {
    return http.post<LoginResponse>("/api/login", payload);
  },
  forgotPassword(payload: ForgotPasswordPayload) {
    return http.post<ForgotPasswordResponse>("/api/forgot-password", payload);
  },
  resetPassword(payload: ResetPasswordPayload) {
    return http.post<ResetPasswordResponse>("/api/reset-password", payload);
  },
  me(token?: string) {
    return http.get<User>("/api/me", token ? { token } : undefined);
  },
};