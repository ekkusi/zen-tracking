import { differenceInCalendarDays } from "date-fns";
import { ParsedChallenge } from "../types/parsedBackendTypes";
import DateUtil from "./DateUtil";

export const getChallengeLength = (challenge: ParsedChallenge): number => {
  const { startDate, endDate } = challenge;
  if (startDate && endDate) {
    return differenceInCalendarDays(new Date(endDate), new Date(startDate));
  }
  return 0;
};

export const getChallengeDateString = (
  challenge: ParsedChallenge,
  noDatesString?: string
): string => {
  const { startDate, endDate } = challenge;
  if (startDate && endDate) {
    return `${DateUtil.format(startDate)} - ${DateUtil.format(endDate)}`;
  }
  return noDatesString || "Ei määritelty";
};
