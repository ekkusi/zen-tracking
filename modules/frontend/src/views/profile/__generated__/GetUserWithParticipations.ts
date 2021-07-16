/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserWithParticipations
// ====================================================

export interface GetUserWithParticipations_getUser_participations_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface GetUserWithParticipations_getUser_participations {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  challenge: GetUserWithParticipations_getUser_participations_challenge;
}

export interface GetUserWithParticipations_getUser {
  __typename: "User";
  name: string;
  email: string | null;
  isPrivate: boolean;
  finishedAndCheckedChallenges: string[];
  participations: GetUserWithParticipations_getUser_participations[];
}

export interface GetUserWithParticipations {
  getUser: GetUserWithParticipations_getUser | null;
}

export interface GetUserWithParticipationsVariables {
  userName: string;
}
