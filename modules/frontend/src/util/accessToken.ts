import { AuthenticatedUser } from "@ekkusi/zen-tracking-backend/lib/types/customContext";

const backendApiBaseUrl = process.env.REACT_APP_BACKEND_API_BASE_URL || "";

let accessToken: string | null = null;

export type DecodedTokenType = {
  user: AuthenticatedUser;
  iat: number;
  exp: number;
};

export const getAccessToken = () => {
  return accessToken;
};

export const setAccessToken = (newToken: string | null) => {
  accessToken = newToken;
};

export const refreshToken = async (): Promise<void> => {
  const response = await fetch(`${backendApiBaseUrl}/refresh-token`, {
    method: "POST",
    credentials: "include",
  });
  const { accessToken: newAccessToken } = await response.json();
  accessToken = newAccessToken || null;
};
