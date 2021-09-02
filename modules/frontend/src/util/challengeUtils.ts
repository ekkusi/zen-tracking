import { differenceInCalendarDays } from "date-fns";
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

export const getParticipationDateString = (
  participation: ParsedChallengeParticipation,
  noDatesString?: string
): string => {
  const { startDate, endDate } = participation;
  if (startDate && endDate) {
    return `${DateUtil.format(startDate)} - ${DateUtil.format(endDate)}`;
  }
  return noDatesString || "Ajankohtaa ei määritelty";
};
