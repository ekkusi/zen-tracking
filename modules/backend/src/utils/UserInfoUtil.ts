import { ChallengeParticipation } from ".prisma/client";
import prisma from "../graphql/client";

export default class UserInfoUtil {
  // Return participation of user which has the latest markings
  public static async getLatestModifiedParticipation(
    userName: string
  ): Promise<ChallengeParticipation | null> {
    const orderedMarkings = await prisma.marking.findMany({
      where: { ChallengeParticipation: { user_name: userName } },
      orderBy: {
        date: "desc",
      },
    });

    if (orderedMarkings[0]) {
      return prisma.challengeParticipation.findFirst({
        where: { id: orderedMarkings[0].participation_id },
      });
    }
    return null;
  }
}
