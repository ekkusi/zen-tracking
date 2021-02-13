import {
  User as PrismaUser,
  Marking as PrismaMarking,
  Prisma,
} from "@prisma/client";
import { User, Marking, MarkingInput } from "../../types/user";

export class UserMapper {
  public static mapUser(user: PrismaUser, userMarkings: PrismaMarking[]): User {
    return {
      ...user,
      isPrivate: user.is_private,
      markings: userMarkings.map((marking) => UserMapper.mapMarking(marking)),
    } as User;
  }

  public static mapMarking(marking: PrismaMarking): Marking {
    return {
      ...marking,
      id: marking.id.toString(),
    } as Marking;
  }

  public static mapMarkingInput(
    userName: string,
    marking: MarkingInput
  ): Prisma.MarkingCreateInput {
    return {
      ...marking,
      activities: marking.activities || undefined,
      User: { connect: { name: userName } },
    };
  }
}
