/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUserQuery
// ====================================================

export interface GetCurrentUserQuery_getCurrentUser_activeParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface GetCurrentUserQuery_getCurrentUser_activeParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
}

export interface GetCurrentUserQuery_getCurrentUser_activeParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: GetCurrentUserQuery_getCurrentUser_activeParticipation_challenge;
  markings: GetCurrentUserQuery_getCurrentUser_activeParticipation_markings[];
}

export interface GetCurrentUserQuery_getCurrentUser {
  __typename: "User";
  name: string;
  isPrivate: boolean;
  activeParticipation: GetCurrentUserQuery_getCurrentUser_activeParticipation | null;
}

export interface GetCurrentUserQuery {
  getCurrentUser: GetCurrentUserQuery_getCurrentUser;
}

export interface GetCurrentUserQueryVariables {
  activeParticipationChallengeId?: string | null;
}
