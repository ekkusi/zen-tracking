/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserParticipationsQuery
// ====================================================

export interface GetUserParticipationsQuery_getUserParticipations_challenge {
  __typename: "Challenge";
  name: string;
}

export interface GetUserParticipationsQuery_getUserParticipations_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
}

export interface GetUserParticipationsQuery_getUserParticipations {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: GetUserParticipationsQuery_getUserParticipations_challenge;
  markings: GetUserParticipationsQuery_getUserParticipations_markings[];
}

export interface GetUserParticipationsQuery {
  getUserParticipations: GetUserParticipationsQuery_getUserParticipations[];
}

export interface GetUserParticipationsQueryVariables {
  userName: string;
}
