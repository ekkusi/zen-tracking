/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MarkingCreateInput } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: AddMarkingMutation
// ====================================================

export interface AddMarkingMutation_addMarking {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
}

export interface AddMarkingMutation {
  addMarking: AddMarkingMutation_addMarking;
}

export interface AddMarkingMutationVariables {
  participationId: string;
  marking: MarkingCreateInput;
}
