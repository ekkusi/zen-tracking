/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateChallengeInput, ChallengeStatus } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateChallengeMutation
// ====================================================

export interface UpdateChallengeMutation_updateChallenge_creator {
  __typename: "User";
  name: string;
}

export interface UpdateChallengeMutation_updateChallenge_participations_user {
  __typename: "User";
  name: string;
}

export interface UpdateChallengeMutation_updateChallenge_participations {
  __typename: "ChallengeParticipation";
  id: string;
  user: UpdateChallengeMutation_updateChallenge_participations_user;
}

export interface UpdateChallengeMutation_updateChallenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  creator: UpdateChallengeMutation_updateChallenge_creator;
  participations: UpdateChallengeMutation_updateChallenge_participations[];
}

export interface UpdateChallengeMutation {
  updateChallenge: UpdateChallengeMutation_updateChallenge;
}

export interface UpdateChallengeMutationVariables {
  id: string;
  args: UpdateChallengeInput;
}
