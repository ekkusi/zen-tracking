/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: ParticipationInfo
// ====================================================

export interface ParticipationInfo_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
  status: ChallengeStatus;
}

export interface ParticipationInfo {
  __typename: "ChallengeParticipation";
  id: string;
  isPrivate: boolean;
  challenge: ParticipationInfo_challenge;
}
