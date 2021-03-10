import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/schema";
import { ParsedChallengeParticipation } from "types/parsedBackendTypes";

export default class UserInfoUtil {
  // Return participation of user which has the latest markings
  public static getLatestModifiedParticipation(
    participations: ParsedChallengeParticipation[]
  ): ParsedChallengeParticipation | null {
    if (participations.length === 0) return null;
    const sortedParticipations = participations.sort((a, b) => {
      const aLatestMarking = UserInfoUtil.getLatestMarking(a.markings);
      const bLatestMarking = UserInfoUtil.getLatestMarking(b.markings);
      if (!aLatestMarking && !!bLatestMarking) return -1;
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
    const sortedMarkings = markings.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedMarkings[0] || null;
  }
}
