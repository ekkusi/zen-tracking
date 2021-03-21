import { User as PrismaUser } from "@prisma/client";
import { AuthenticatedUser } from "../../types/customContext";

export class UserMapper {
  public static mapAuthenticatedUser(user: PrismaUser): AuthenticatedUser {
    return {
      name: user.name,
      isPrivate: user.is_private,
    };
  }
}
