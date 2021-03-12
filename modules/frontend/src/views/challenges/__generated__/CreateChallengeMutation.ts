/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateChallengeInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateChallengeMutation
// ====================================================

export interface CreateChallengeMutation_createChallenge {
  __typename: "Challenge";
  id: string;
}

export interface CreateChallengeMutation {
  createChallenge: CreateChallengeMutation_createChallenge;
}

export interface CreateChallengeMutationVariables {
  challenge: CreateChallengeInput;
}
