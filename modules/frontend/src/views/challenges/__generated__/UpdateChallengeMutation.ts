/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateChallengeInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateChallengeMutation
// ====================================================

export interface UpdateChallengeMutation_updateChallenge {
  __typename: "Challenge";
  id: string;
}

export interface UpdateChallengeMutation {
  updateChallenge: UpdateChallengeMutation_updateChallenge;
}

export interface UpdateChallengeMutationVariables {
  id: string;
  args: UpdateChallengeInput;
}
