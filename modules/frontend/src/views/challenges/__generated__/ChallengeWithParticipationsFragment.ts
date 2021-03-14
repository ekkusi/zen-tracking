/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChallengeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL fragment: ChallengeWithParticipationsFragment
// ====================================================

export interface ChallengeWithParticipationsFragment_creator {
  __typename: "User";
  name: string;
}

export interface ChallengeWithParticipationsFragment_participations_user {
  __typename: "User";
  name: string;
}

export interface ChallengeWithParticipationsFragment_participations {
  __typename: "ChallengeParticipation";
  id: string;
  user: ChallengeWithParticipationsFragment_participations_user;
}

export interface ChallengeWithParticipationsFragment {
  __typename: "Challenge";
  id: string;
  name: string;
  status: ChallengeStatus;
  startDate: any | null;
  endDate: any | null;
  description: string;
  creator: ChallengeWithParticipationsFragment_creator;
  participations: ChallengeWithParticipationsFragment_participations[];
}
