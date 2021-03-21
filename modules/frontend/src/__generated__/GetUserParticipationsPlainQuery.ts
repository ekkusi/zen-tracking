/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserParticipationsPlainQuery
// ====================================================

export interface GetUserParticipationsPlainQuery_getUserParticipations_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
}

export interface GetUserParticipationsPlainQuery_getUserParticipations {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: GetUserParticipationsPlainQuery_getUserParticipations_challenge;
}

export interface GetUserParticipationsPlainQuery {
  getUserParticipations: GetUserParticipationsPlainQuery_getUserParticipations[];
}
