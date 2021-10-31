import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { differenceInCalendarDays } from "date-fns";
import { isAfter, isBefore } from "date-fns/esm";
import {
  ParsedChallenge,
  ParsedChallengeParticipation,
} from "../types/parsedBackendTypes";
import DateUtil from "./DateUtil";

export const getChallengeLength = (challenge: ParsedChallenge): number => {
  const { startDate, endDate } = challenge;
  if (startDate && endDate) {
    return differenceInCalendarDays(new Date(endDate), new Date(startDate));
  }
  return 0;
};

export const getParticipationLength = (
  participation: ParsedChallengeParticipation
): number => {
  const { startDate, endDate } = participation;
  if (startDate && endDate) {
    return differenceInCalendarDays(new Date(endDate), new Date(startDate));
  }
  return 0;
};

export const getParticipationDateString = (
  participation: ParsedChallengeParticipation,
  noDatesString?: string
): string => {
  const { startDate, endDate } = participation;
  if (startDate && endDate) {
    return `${DateUtil.format(startDate)} - ${DateUtil.format(endDate)}`;
  }
  return noDatesString !== undefined
    ? noDatesString
    : "Ajankohtaa ei määritelty";
};

export const getMarkingsOutsideDates = (
  markings: Marking[],
  startDate: Date,
  endDate: Date
): Marking[] => {
  return markings.filter((it) => {
    const date = new Date(it.date);
    return isBefore(date, startDate) || isAfter(date, endDate);
  });
};
