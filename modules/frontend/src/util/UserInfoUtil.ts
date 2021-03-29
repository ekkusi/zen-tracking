import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { ParsedChallengeParticipation } from "types/parsedBackendTypes";
import { ActiveParticipation } from "../store/types";
import DateUtil from "./DateUtil";

export default class UserInfoUtil {
  // Return participation of user which has the latest markings
  public static getLatestModifiedParticipation(
    participations: ParsedChallengeParticipation[]
  ): ParsedChallengeParticipation | null {
    const activeParticipations = participations.filter((it) => {
      const { startDate, endDate } = it.challenge;
      if (!startDate || !endDate) return false;
      const currentDate = new Date();
      if (
        DateUtil.isBetween(currentDate, new Date(startDate), new Date(endDate))
      )
        return true;
      return false;
    });
    if (activeParticipations.length === 0) return null;
    const sortedParticipations = [...activeParticipations];
    sortedParticipations.sort((a, b) => {
      const aLatestMarking = UserInfoUtil.getLatestMarking(a.markings || []);
      const bLatestMarking = UserInfoUtil.getLatestMarking(b.markings || []);
      if (!aLatestMarking && !bLatestMarking) return -1;
      if (!bLatestMarking) return -1;
      if (!aLatestMarking) return 1;
      return (
        new Date(aLatestMarking.date).getTime() -
        new Date(bLatestMarking.date).getTime()
      );
    });
    return sortedParticipations[0];
  }

  // Return latest marking of markings array
  public static getLatestMarking(markings: Marking[]): Marking | null {
    const sortedMarkings = [...markings];
    sortedMarkings.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedMarkings[sortedMarkings.length - 1] || null;
  }

  // Return latest marking of markings array
  public static getEarliestMarking(markings: Marking[]): Marking | null {
    const sortedMarkings = [...markings];
    sortedMarkings.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedMarkings[0] || null;
  }

  public static sortParticipations(
    participations: ParsedChallengeParticipation[],
    activeParticipation?: ActiveParticipation | null
  ): ParsedChallengeParticipation[] {
    const sortedParticipations = participations.slice().sort((a, b) => {
      const { endDate: aEndDateString } = a.challenge;
      const { endDate: bEndDateString } = b.challenge;

      if (activeParticipation) {
        if (a.id === activeParticipation.id) return -1;
        if (b.id === activeParticipation.id) return 1;
      }

      const aCompareNumber = aEndDateString
        ? new Date(aEndDateString).getTime()
        : 0;
      const bCompareNumber = bEndDateString
        ? new Date(bEndDateString).getTime()
        : 0;

      return bCompareNumber - aCompareNumber;
    });
    return sortedParticipations;
  }
}
