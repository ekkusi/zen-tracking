import { ChallengeParticipation, Marking } from "@prisma/client";

export type MarkingsLoadResult = {
  [name: string]: Marking[];
};

export type ParticipationsLoadResult = {
  [name: string]: ChallengeParticipation[];
};
