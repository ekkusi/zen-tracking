/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetChallenge
// ====================================================

export interface GetChallenge_getChallenge_creator {
  __typename: "User";
  name: string;
}

export interface GetChallenge_getChallenge_participations_user {
  __typename: "User";
  name: string;
}

export interface GetChallenge_getChallenge_participations {
  __typename: "ChallengeParticipation";
  id: string;
  startDate: any | null;
  endDate: any | null;
  user: GetChallenge_getChallenge_participations_user;
}

export interface GetChallenge_getChallenge {
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
  creator: GetChallenge_getChallenge_creator;
  participations: GetChallenge_getChallenge_participations[];
}

export interface GetChallenge {
  getChallenge: GetChallenge_getChallenge | null;
}

export interface GetChallengeVariables {
  id: string;
}
