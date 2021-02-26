import {
  User as PrismaUser,
  Marking as PrismaMarking,
  Prisma,
} from "@prisma/client";
import { User, Marking, MarkingInput } from "../../types/user";

export class UserMapper {
  public static mapUser(user: PrismaUser): User {
    return {
      ...user,
      isPrivate: user.is_private,
      markings: [], // Graphql should handle getting markings from User.markings resolver, return empty array here to handle ts errors
    } as User;
  }

  public static mapMarking(marking: PrismaMarking): Marking {
    return {
      ...marking,
      date: marking.date.toISOString(),
      id: marking.id.toString(),
    } as Marking;
  }

  public static mapCreateMarkingInput(
    userName: string,
    marking: MarkingInput
  ): Prisma.MarkingCreateInput {
    return {
      ...marking,
      date: marking.date ? new Date(marking.date) : undefined,
      User: { connect: { name: userName } },
    };
  }

  public static mapEditMarkingInput(
    marking: MarkingInput
  ): Prisma.MarkingUpdateInput {
    return {
      ...marking,
      date: marking.date ? new Date(marking.date) : undefined,
    };
  }
}
