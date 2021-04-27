/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUser
// ====================================================

export interface GetCurrentUser_getCurrentUser_activeParticipation_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface GetCurrentUser_getCurrentUser_activeParticipation_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface GetCurrentUser_getCurrentUser_activeParticipation {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  challenge: GetCurrentUser_getCurrentUser_activeParticipation_challenge;
  markings: GetCurrentUser_getCurrentUser_activeParticipation_markings[];
}

export interface GetCurrentUser_getCurrentUser {
  __typename: "User";
  name: string;
  email: string | null;
  isPrivate: boolean;
  activeParticipation: GetCurrentUser_getCurrentUser_activeParticipation | null;
}

export interface GetCurrentUser {
  getCurrentUser: GetCurrentUser_getCurrentUser;
}

export interface GetCurrentUserVariables {
  activeParticipationChallengeId?: string | null;
}
