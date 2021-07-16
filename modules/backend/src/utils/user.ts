import { AuthenticatedUser } from "../types/customContext";

export const checkIfIsUser = (user: any): user is AuthenticatedUser => {
  if (
    typeof user !== "object" ||
    user.name === undefined ||
    user.isPrivate === undefined ||
    user.email === undefined ||
    !Array.isArray(user.finishedAndCheckedChallenges)
  )
    return false;
  return true;
};
