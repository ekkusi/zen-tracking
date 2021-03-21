import { AuthenticatedUser } from "@ekkusi/zen-tracking-backend/lib/types/customContext";
import decodeJwt from "jwt-decode";

export default (token: string): AuthenticatedUser => {
  const decoded = decodeJwt<{ user: AuthenticatedUser }>(token);
  return decoded.user;
};
