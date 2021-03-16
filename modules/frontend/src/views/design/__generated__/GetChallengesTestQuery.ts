/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetChallengesTestQuery
// ====================================================

export interface GetChallengesTestQuery_getChallenges {
  __typename: "Challenge";
  name: string;
}

export interface GetChallengesTestQuery {
  getChallenges: GetChallengesTestQuery_getChallenges[];
}

export interface GetChallengesTestQueryVariables {
  status: ChallengeStatus;
}
