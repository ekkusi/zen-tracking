import { Prisma } from "@prisma/client";
import { isAfter, isBefore } from "date-fns";
import { formatIsoString } from "../../utils/dateUtils";
import {
  MarkingInput,
  CreateChallengeInput,
  UpdateChallengeInput,
  ChallengeStatus,
} from "../../types/schema";

export class ChallengeMapper {
  public static mapCreateMarkingInput(
    participationId: string,
    marking: MarkingInput
  ): Prisma.MarkingCreateInput {
    return {
      ...marking,
      ChallengeParticipation: { connect: { id: participationId } },
      date: marking.date
        ? formatIsoString(marking.date)
        : formatIsoString(new Date()),
    };
  }

  public static mapEditMarkingInput(
    marking: MarkingInput
  ): Prisma.MarkingUpdateInput {
    return {
      ...marking,
      date: marking.date ? formatIsoString(marking.date) : undefined,
    };
  }

  public static mapCreateChallengeInput(
    challenge: CreateChallengeInput
  ): Prisma.ChallengeCreateInput {
    const { startDate, endDate, creatorName, ...rest } = challenge;
    return {
      ...rest,
      User: { connect: { name: creatorName } },
      end_date: endDate ? formatIsoString(endDate) : undefined,
      start_date: startDate ? formatIsoString(startDate) : undefined,
    };
  }

  public static mapChallengeStatus(
    startDate: Date | null,
    endDate: Date | null
  ): ChallengeStatus {
    // If start date or end date is not defined, challenge is suggestion
    if (!startDate || !endDate) return ChallengeStatus.Suggestion;
    const currentDate = new Date();
    // If currentDate < startDate, challenge is upcoming
    if (isBefore(currentDate, startDate)) return ChallengeStatus.Upcoming;
    // If startDate < currentDate < endDate -> challenge is active
    if (isAfter(currentDate, startDate) && isBefore(currentDate, endDate))
      return ChallengeStatus.Active;
    // Otherwise challenge is
    return ChallengeStatus.Ended;
  }

  public static mapEditChallengeInput(
    args: UpdateChallengeInput
  ): Prisma.ChallengeUpdateInput {
    const { startDate, endDate, ...rest } = args;

    return {
      ...rest,
      name: args.name ? args.name : undefined,
      description: args.description ? args.description : undefined,
      end_date: endDate ? formatIsoString(endDate) : undefined,
      start_date: startDate ? formatIsoString(startDate) : undefined,
    };
  }
}
