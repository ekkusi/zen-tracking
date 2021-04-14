import {
  ChallengeParticipation,
  Marking,
  User,
} from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { ChallengeData } from "../__generated__/ChallengeData";

export type ParsedChallenge = Omit<Partial<ChallengeData>, "name" | "id"> & {
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
