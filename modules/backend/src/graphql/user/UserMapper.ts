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
    console.log("mapMarking", JSON.stringify(marking));
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
      activities: marking.activities || undefined,
      User: { connect: { name: userName } },
    };
  }

  public static mapEditMarkingInput(
    marking: MarkingInput
  ): Prisma.MarkingUpdateInput {
    console.log("mapEditMarkingDate:", marking.date);
    console.log(
      "mapEditMarkingDate after convert:",
      new Date(marking.date || 0)
    );

    return {
      ...marking,
      date: marking.date ? new Date(marking.date) : undefined,
      activities: marking.activities || undefined,
    };
  }
}
