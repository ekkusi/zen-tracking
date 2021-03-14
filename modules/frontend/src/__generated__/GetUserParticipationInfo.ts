/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GetUserParticipationInfo
// ====================================================

export interface GetUserParticipationInfo_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface GetUserParticipationInfo_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
}

export interface GetUserParticipationInfo {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: GetUserParticipationInfo_challenge;
  markings: GetUserParticipationInfo_markings[];
}
