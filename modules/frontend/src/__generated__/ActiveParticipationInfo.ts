/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ActiveParticipationInfo
// ====================================================

export interface ActiveParticipationInfo_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface ActiveParticipationInfo_markings {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
}

export interface ActiveParticipationInfo {
  __typename: "ChallengeParticipation";
  id: string;
  challenge: ActiveParticipationInfo_challenge;
  markings: ActiveParticipationInfo_markings[];
}