/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL fragment: ChallengeWithParticipations
// ====================================================

export interface ChallengeWithParticipations_creator {
  __typename: "User";
  name: string;
}

export interface ChallengeWithParticipations_participations_user {
  __typename: "User";
  name: string;
}

export interface ChallengeWithParticipations_participations {
  __typename: "ChallengeParticipation";
  id: string;
  user: ChallengeWithParticipations_participations_user;
}

export interface ChallengeWithParticipations {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  creator: ChallengeWithParticipations_creator;
  participations: ChallengeWithParticipations_participations[];
}
