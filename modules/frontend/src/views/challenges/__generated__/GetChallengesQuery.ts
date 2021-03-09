/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetChallengesQuery
// ====================================================

export interface GetChallengesQuery_getChallenges_creator {
  __typename: "User";
  name: string;
}

export interface GetChallengesQuery_getChallenges_participations {
  __typename: "ChallengeParticipation";
  id: string;
}

export interface GetChallengesQuery_getChallenges {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  creator: GetChallengesQuery_getChallenges_creator;
  participations: GetChallengesQuery_getChallenges_participations[];
}

export interface GetChallengesQuery {
  getChallenges: GetChallengesQuery_getChallenges[];
}
