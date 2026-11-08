import axiosClient from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { AuthUser, RegisterInput } from "../types/auth";

interface Session {
  token: string;
  user: AuthUser;
}

export const login = async (username: string, password: string): Promise<Session> => {
  const res = await axiosClient.post<ApiResponse<Session>>("/auth/login", { username, password });
  return res.data.data;
};

export const register = async (input: RegisterInput): Promise<Session> => {
  const res = await axiosClient.post<ApiResponse<Session>>("/auth/register", input);
  return res.data.data;
};

export const getSecurityQuestion = async (username: string): Promise<string> => {
  const res = await axiosClient.post<ApiResponse<{ question: string }>>("/auth/forgot/question", {
    username,
  });
  return res.data.data.question;
};

export const resetPassword = async (
  username: string,
  security_answer: string,
  new_password: string
): Promise<void> => {
  await axiosClient.post("/auth/forgot/reset", { username, security_answer, new_password });
};

export const getMe = async (): Promise<AuthUser> => {
  const res = await axiosClient.get<ApiResponse<AuthUser>>("/auth/me");
  return res.data.data;
};
