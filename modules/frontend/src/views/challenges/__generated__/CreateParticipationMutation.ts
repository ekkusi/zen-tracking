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
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface CreateParticipationMutation_createParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
}

export interface CreateParticipationMutation_createParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: CreateParticipationMutation_createParticipation_challenge;
  markings: CreateParticipationMutation_createParticipation_markings[];
}

export interface CreateParticipationMutation {
  createParticipation: CreateParticipationMutation_createParticipation;
}

export interface CreateParticipationMutationVariables {
  challengeId: string;
}
