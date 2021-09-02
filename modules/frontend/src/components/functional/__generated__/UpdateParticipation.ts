/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateParticipationInput, ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateParticipation
// ====================================================

export interface UpdateParticipation_updateParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
}

export interface UpdateParticipation_updateParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  startDate: any | null;
  endDate: any | null;
  challenge: UpdateParticipation_updateParticipation_challenge;
}

export interface UpdateParticipation {
  updateParticipation: UpdateParticipation_updateParticipation;
}

export interface UpdateParticipationVariables {
  id: string;
  input: UpdateParticipationInput;
}
