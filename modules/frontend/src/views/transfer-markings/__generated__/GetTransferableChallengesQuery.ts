/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DateFilter } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTransferableChallengesQuery
// ====================================================

export interface GetTransferableChallengesQuery_getChallenges {
  __typename: "Challenge";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
}

export interface GetTransferableChallengesQuery {
  getChallenges: GetTransferableChallengesQuery_getChallenges[];
}

export interface GetTransferableChallengesQueryVariables {
  startDate: DateFilter;
  endDate: DateFilter;
}
