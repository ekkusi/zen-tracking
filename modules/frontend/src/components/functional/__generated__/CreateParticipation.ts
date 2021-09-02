/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateParticipationInput, ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateParticipation
// ====================================================

export interface CreateParticipation_createParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
}

export interface CreateParticipation_createParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  startDate: any | null;
  endDate: any | null;
  challenge: CreateParticipation_createParticipation_challenge;
}

export interface CreateParticipation {
  createParticipation: CreateParticipation_createParticipation;
}

export interface CreateParticipationVariables {
  input: CreateParticipationInput;
}
