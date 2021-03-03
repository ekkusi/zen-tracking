import { User as PrismaUser } from "@prisma/client";
import { User } from "../../types/user";

export class UserMapper {
  public static mapUser(user: PrismaUser): User {
    return {
      ...user,
      isPrivate: user.is_private,
      participations: [],
    } as User;
  }
}
