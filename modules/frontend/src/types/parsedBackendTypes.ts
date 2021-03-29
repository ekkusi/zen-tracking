import {
  Challenge,
  ChallengeParticipation,
  Marking,
  User,
} from "@ekkusi/zen-tracking-backend/lib/types/schema";

export type ParsedChallenge = Omit<
  Partial<Challenge>,
  "name" | "id" | "isPrivate"
> & {
  id: string;
  name: string;
};

export type ParsedChallengeParticipation = Omit<
  ChallengeParticipation,
  "user" | "challenge" | "markings"
> & {
  user?: User;
  markings?: Marking[];
  challenge: ParsedChallenge;
};

export type ParsedUser = Omit<User, "participations">;
