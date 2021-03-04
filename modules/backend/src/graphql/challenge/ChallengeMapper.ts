import { Prisma } from "@prisma/client";
import {
  MarkingInput,
  CreateChallengeInput,
  UpdateChallengeInput,
} from "../../types/schema";

export class ChallengeMapper {
  public static mapCreateMarkingInput(
    participationId: string,
    marking: MarkingInput
  ): Prisma.MarkingCreateInput {
    return {
      ...marking,
      ChallengeParticipation: { connect: { id: participationId } },
      date: marking.date ? new Date(marking.date) : undefined,
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

  public static mapCreateChallengeInput(
    challenge: CreateChallengeInput
  ): Prisma.ChallengeCreateInput {
    return {
      ...challenge,
      User: { connect: { name: challenge.creatorName } },
      end_date: challenge.startDate ? new Date(challenge.startDate) : undefined,
      start_date: challenge.endDate ? new Date(challenge.endDate) : undefined,
    };
  }

  public static mapEditChallengeInput(
    args: UpdateChallengeInput
  ): Prisma.ChallengeUpdateInput {
    return {
      ...args,
      name: args.name ? args.name : undefined,
      status: args.status ? args.status : undefined,
      description: args.description ? args.description : undefined,
      end_date: args.startDate ? new Date(args.startDate) : undefined,
      start_date: args.endDate ? new Date(args.endDate) : undefined,
    };
  }
}
