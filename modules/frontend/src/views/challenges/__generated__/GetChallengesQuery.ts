/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetChallengesQuery
// ====================================================

export interface GetChallengesQuery_getChallenges {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
}

export interface GetChallengesQuery {
  getChallenges: GetChallengesQuery_getChallenges[];
}
