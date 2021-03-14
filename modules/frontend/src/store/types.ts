import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/schema";
import {
  ParsedChallengeParticipation,
  ParsedUser,
} from "types/parsedBackendTypes";

export type ActionTypes = {
  updateUser: (user: ParsedUser | null) => void;
  updateError: (error: string | null) => void;
  updateActiveParticipation: (challengeId?: string | null) => Promise<void>;
  updateActiveParticipationMarkings: (markings: Marking[]) => void;
};

export type GlobalState = {
  currentUser: ParsedUser;
  activeParticipation: ParsedChallengeParticipation | null;
  error: string | null;
};
