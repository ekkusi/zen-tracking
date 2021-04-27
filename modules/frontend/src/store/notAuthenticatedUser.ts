import { AuthenticatedUser } from "@ekkusi/zen-tracking-backend/lib/types/customContext";

export const notAuthorizedUser: AuthenticatedUser = {
  name: "not-authorized",
  email: "not-authorized@email.com",
  isPrivate: false,
};
