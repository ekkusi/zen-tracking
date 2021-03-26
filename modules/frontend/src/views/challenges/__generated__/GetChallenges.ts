/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetChallenges
// ====================================================

export interface GetChallenges_getChallenges_creator {
  __typename: "User";
  name: string;
}

export interface GetChallenges_getChallenges_participations_user {
  __typename: "User";
  name: string;
}

export interface GetChallenges_getChallenges_participations {
  __typename: "ChallengeParticipation";
  id: string;
  user: GetChallenges_getChallenges_participations_user;
}

export interface GetChallenges_getChallenges {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  creator: GetChallenges_getChallenges_creator;
  participations: GetChallenges_getChallenges_participations[];
}

export interface GetChallenges {
  getChallenges: GetChallenges_getChallenges[];
}
