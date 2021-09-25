import { AuthenticatedUser } from "@ekkusi/zen-tracking-backend/lib/types/customContext";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import {
  ParsedChallenge,
  ParsedChallengeParticipation,
} from "types/parsedBackendTypes";
import { ConfirmationModalProps } from "../components/general/ConfirmationModal";

export type ActionTypes = {
  updateUser: (user: AuthenticatedUser | null) => void;
  updateError: (error: string | null) => void;
  updateActiveParticipationOld: (challengeId?: string | null) => Promise<void>;
  updateActiveParticipation: (
    participation: ActiveParticipation | null
  ) => void;
  updateActiveParticipationMarkings: (markings: Marking[]) => void;
  logout: () => Promise<void>;
  updatePromptEvent: (event: BeforeInstallPromptEvent | null) => void;
  setHideNavigation: (state: boolean) => void;
  setModal: (modalProps: ConfirmationModalProps | null) => void;
  setBottomNavigationBarState: (state: "hidden" | "visible") => void;
};

export type ActiveParticipation = Omit<
  ParsedChallengeParticipation,
  "markings" | "challenge" | "startDate" | "endDate"
> & {
  markings: Marking[];
  challenge: ParsedChallenge;
  startDate: string;
  endDate: string;
};

export type GlobalState = {
  currentUser: AuthenticatedUser;
  activeParticipation: ActiveParticipation | null;
  error: string | null;
  accessToken: string | null;
  promptEvent: BeforeInstallPromptEvent | null;
  modalProps: ConfirmationModalProps | null;
  hideNavigation: boolean;
  bottomNavigationBarState: "hidden" | "visible";
};
