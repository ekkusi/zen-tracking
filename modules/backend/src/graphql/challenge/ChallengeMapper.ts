import { Prisma } from "@prisma/client";
import { isAfter, isBefore } from "date-fns";
import { formatIsoString } from "../../utils/dateUtils";
import {
  CreateChallengeInput,
  UpdateChallengeInput,
  ChallengeStatus,
  QueryGetChallengesArgs,
  DateFilter,
  MarkingUpdateInput,
  MarkingCreateInput,
} from "../../types/schema";

import { NO_PARTICIPATION_MARKINGS_HOLDER_NAME } from "../../config.json";

type GetChallengesFilters = {
  AND: Prisma.ChallengeWhereInput;
};

export class ChallengeMapper {
  public static mapCreateMarkingInput(
    participationId: string,
    marking: MarkingCreateInput
  ): Prisma.MarkingCreateInput {
    const { photoUrl, ...args } = marking;
    return {
      ...args,
      photo_url: photoUrl,
      ChallengeParticipation: { connect: { id: participationId } },
      date: marking.date
        ? formatIsoString(marking.date)
        : formatIsoString(new Date()),
    };
  }

  public static mapEditMarkingInput(
    marking: MarkingUpdateInput
  ): Prisma.MarkingUpdateInput {
    const { photoUrl, ...args } = marking;
    return {
      ...args,
      rating: args.rating ?? undefined,
      date: marking.date ? formatIsoString(marking.date) : undefined,
      photo_url: photoUrl,
    };
  }

  public static mapCreateChallengeInput(
    challenge: CreateChallengeInput,
    creatorName: string
  ): Prisma.ChallengeCreateInput {
    const { startDate, endDate, ...rest } = challenge;
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

  public static mapChallengeFilters(
    args: QueryGetChallengesArgs
  ): GetChallengesFilters {
    const { creatorName, status, startDate, endDate } = args;
    let andWhereInput: Prisma.ChallengeWhereInput = {
      NOT: {
        name: NO_PARTICIPATION_MARKINGS_HOLDER_NAME, // Filter out challenge that keeps markings without participation
      },
    };
    if (creatorName) andWhereInput.creator_name = creatorName;
    if (status)
      andWhereInput = {
        ...andWhereInput,
        ...this.mapChallengeStatusFilter(status),
      };
    // These will overwrite status filters, if both are passed
    if (startDate) {
      andWhereInput.start_date = this.mapDateFilter(startDate);
    }
    if (endDate) {
      andWhereInput.end_date = this.mapDateFilter(endDate);
    }
    return {
      AND: andWhereInput,
    };
  }

  public static mapDateFilter(
    dateFilter: DateFilter
  ): Prisma.DateTimeNullableFilter {
    const { gte, gt, lte, lt } = dateFilter;
    return {
      gte: gte ? new Date(gte) : undefined,
      gt: gt ? new Date(gt) : undefined,
      lte: lte ? new Date(lte) : undefined,
      lt: lt ? new Date(lt) : undefined,
    };
  }

  public static mapChallengeStatusFilter(
    status: ChallengeStatus
  ): Prisma.ChallengeWhereInput {
    const filter: Prisma.ChallengeWhereInput = {};
    const currentDateString = formatIsoString(new Date());
    switch (status) {
      case ChallengeStatus.Active:
        filter.start_date = {
          lte: currentDateString,
        };
        filter.end_date = {
          gte: currentDateString,
        };
        break;
      case ChallengeStatus.Ended:
        filter.end_date = {
          lt: currentDateString,
        };
        break;
      case ChallengeStatus.Upcoming:
        filter.start_date = {
          gt: currentDateString,
        };
        break;
      default:
        filter.start_date = null;
        filter.end_date = null;
    }
    return filter;
  }
}
