/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateChallengeInput, ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateChallenge
// ====================================================

export interface UpdateChallenge_updateChallenge_creator {
  __typename: "User";
  name: string;
}

export interface UpdateChallenge_updateChallenge_participations_user {
  __typename: "User";
  name: string;
}

export interface UpdateChallenge_updateChallenge_participations {
  __typename: "ChallengeParticipation";
  id: string;
  startDate: any | null;
  endDate: any | null;
  user: UpdateChallenge_updateChallenge_participations_user;
}

export interface UpdateChallenge_updateChallenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  createdAt: any;
  description: string;
  isPrivate: boolean;
  photoUrl: string | null;
  creator: UpdateChallenge_updateChallenge_creator;
  participations: UpdateChallenge_updateChallenge_participations[];
}

export interface UpdateChallenge {
  updateChallenge: UpdateChallenge_updateChallenge;
}

export interface UpdateChallengeVariables {
  id: string;
  args: UpdateChallengeInput;
}
