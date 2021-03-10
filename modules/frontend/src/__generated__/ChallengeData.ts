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

export interface ChallengeData {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  creator: ChallengeData_creator;
}
