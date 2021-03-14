/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateChallengeInput, ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateChallengeMutation
// ====================================================

export interface CreateChallengeMutation_createChallenge_creator {
  __typename: "User";
  name: string;
}

export interface CreateChallengeMutation_createChallenge_participations_user {
  __typename: "User";
  name: string;
}

export interface CreateChallengeMutation_createChallenge_participations {
  __typename: "ChallengeParticipation";
  id: string;
  user: CreateChallengeMutation_createChallenge_participations_user;
}

export interface CreateChallengeMutation_createChallenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  creator: CreateChallengeMutation_createChallenge_creator;
  participations: CreateChallengeMutation_createChallenge_participations[];
}

export interface CreateChallengeMutation {
  createChallenge: CreateChallengeMutation_createChallenge;
}

export interface CreateChallengeMutationVariables {
  challenge: CreateChallengeInput;
}
