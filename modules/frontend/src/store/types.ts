import { User as BaseUser, ChallengeParticipation } from "@ekeukko/zen-tracking-backend/lib/types/schema";

export type User = BaseUser & {
  activeParticipation?: ChallengeParticipation;
};

export type ActionTypes = {
  updateUser: (user: User | null) => void;
  updateError: (error: string | null) => void;
};

export type GlobalState = {
  currentUser: User | null;
  error: string | null;
};
