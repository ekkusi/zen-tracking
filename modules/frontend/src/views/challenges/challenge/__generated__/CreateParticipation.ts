/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateParticipationInput, ChallengeStatus } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateParticipation
// ====================================================

export interface CreateParticipation_createParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
}

export interface CreateParticipation_createParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface CreateParticipation_createParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  startDate: any | null;
  endDate: any | null;
  challenge: CreateParticipation_createParticipation_challenge;
  markings: CreateParticipation_createParticipation_markings[];
}

export interface CreateParticipation {
  createParticipation: CreateParticipation_createParticipation;
}

export interface CreateParticipationVariables {
  input: CreateParticipationInput;
}
