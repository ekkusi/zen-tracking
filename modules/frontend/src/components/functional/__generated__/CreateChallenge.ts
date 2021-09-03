/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateChallengeInput, ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateChallenge
// ====================================================

export interface CreateChallenge_createChallenge_creator {
  __typename: "User";
  name: string;
}

export interface CreateChallenge_createChallenge_participations_user {
  __typename: "User";
  name: string;
}

export interface CreateChallenge_createChallenge_participations {
  __typename: "ChallengeParticipation";
  id: string;
  startDate: any | null;
  endDate: any | null;
  user: CreateChallenge_createChallenge_participations_user;
}

export interface CreateChallenge_createChallenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  isPrivate: boolean;
  creator: CreateChallenge_createChallenge_creator;
  participations: CreateChallenge_createChallenge_participations[];
}

export interface CreateChallenge {
  createChallenge: CreateChallenge_createChallenge;
}

export interface CreateChallengeVariables {
  challenge: CreateChallengeInput;
}
