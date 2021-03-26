/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DateFilter } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTransferableChallenges
// ====================================================

export interface GetTransferableChallenges_getChallenges {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface GetTransferableChallenges {
  getChallenges: GetTransferableChallenges_getChallenges[];
}

export interface GetTransferableChallengesVariables {
  startDate: DateFilter;
  endDate: DateFilter;
}
