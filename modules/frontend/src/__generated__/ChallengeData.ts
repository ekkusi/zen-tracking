/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: ChallengeData
// ====================================================

export interface ChallengeData_creator {
  __typename: "User";
  name: string;
}

export interface ChallengeData_participations_user {
  __typename: "User";
  name: string;
}

export interface ChallengeData_participations {
  __typename: "ChallengeParticipation";
  id: string;
  startDate: any | null;
  endDate: any | null;
  user: ChallengeData_participations_user;
}

export interface ChallengeData {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  createdAt: any;
  description: string;
  isPrivate: boolean;
  photoUrl: string | null;
  creator: ChallengeData_creator;
  participations: ChallengeData_participations[];
}
