import {
  ChallengeParticipation,
  User,
} from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { ChallengeData } from "../__generated__/ChallengeData";

export type ParsedChallenge = Omit<Partial<ChallengeData>, "name" | "id"> & {
  id: string;
  name: string;
};

export type ParsedChallengeParticipation = Omit<
  Partial<ChallengeParticipation>,
  "challenge" | "user" | "id"
> & {
  id: string;
  user?: ParsedUser;
  challenge?: ParsedChallenge;
};

export type ParsedUser = Omit<Partial<User>, "name"> & {
  name: string;
};
