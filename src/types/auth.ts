/**
 * Authentication types
 */

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "agent" | "client";
};

export type AuthSession = {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export type AuthError = {
  message: string;
  code?: string;
};
