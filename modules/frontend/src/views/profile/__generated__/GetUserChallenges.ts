/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetUserChallenges
// ====================================================

export interface GetUserChallenges_getChallenges_creator {
  __typename: "User";
  name: string;
}

export interface GetUserChallenges_getChallenges {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  isPrivate: boolean;
  creator: GetUserChallenges_getChallenges_creator;
}

export interface GetUserChallenges {
  getChallenges: GetUserChallenges_getChallenges[];
}

export interface GetUserChallengesVariables {
  userName: string;
}
