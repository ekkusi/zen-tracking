/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateParticipationMutation
// ====================================================

export interface CreateParticipationMutation_createParticipation_challenge {
  __typename: "Challenge";
  id: string;
}

export interface CreateParticipationMutation_createParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: CreateParticipationMutation_createParticipation_challenge;
}

export interface CreateParticipationMutation {
  createParticipation: CreateParticipationMutation_createParticipation;
}

export interface CreateParticipationMutationVariables {
  challengeId: string;
  userName: string;
}
