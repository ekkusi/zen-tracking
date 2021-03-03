import { Prisma, Marking as PrismaMarking } from "@prisma/client";
import { Marking, MarkingInput } from "../../types/challenge";

export class ChallengeMapper {
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
