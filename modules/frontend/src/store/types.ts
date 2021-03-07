import {
  ParsedChallengeParticipation,
  ParsedUser,
} from "types/parsedBackendTypes";

export type ActionTypes = {
  updateUser: (user: ParsedUser | null) => void;
  updateError: (error: string | null) => void;
  updateActiveParticipation: (
    participation: ParsedChallengeParticipation | null
  ) => void;
};

export type GlobalState = {
  currentUser: ParsedUser;
  activeParticipation: ParsedChallengeParticipation | null;
  error: string | null;
};
