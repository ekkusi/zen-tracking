import {
  Challenge,
  ChallengeParticipation,
  User,
} from "@ekkusi/zen-tracking-backend/lib/types/schema";

export type ParsedChallenge = Omit<Partial<Challenge>, "name" | "id"> & {
  id: string;
  name: string;
};

export type ParsedChallengeParticipation = Omit<
  ChallengeParticipation,
  "user" | "challenge"
> & {
  user?: User;
  challenge: ParsedChallenge;
};

export type ParsedUser = Omit<User, "participations">;
