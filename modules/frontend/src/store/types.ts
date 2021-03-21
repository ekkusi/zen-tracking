import { AuthenticatedUser } from "@ekkusi/zen-tracking-backend/lib/types/customContext";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { ParsedChallengeParticipation } from "types/parsedBackendTypes";

export type ActionTypes = {
  updateUser: (user: AuthenticatedUser | null) => void;
  updateError: (error: string | null) => void;
  updateActiveParticipationOld: (challengeId?: string | null) => Promise<void>;
  updateActiveParticipation: (
    participation: ParsedChallengeParticipation | null
  ) => void;
  updateActiveParticipationMarkings: (markings: Marking[]) => void;
  logout: () => Promise<void>;
};

export type GlobalState = {
  currentUser: AuthenticatedUser;
  activeParticipation: ParsedChallengeParticipation | null;
  error: string | null;
  accessToken: string | null;
};
