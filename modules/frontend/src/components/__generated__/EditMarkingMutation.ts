/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MarkingUpdateInput } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: EditMarkingMutation
// ====================================================

export interface EditMarkingMutation_editMarking {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
}

export interface EditMarkingMutation {
  editMarking: EditMarkingMutation_editMarking;
}

export interface EditMarkingMutationVariables {
  id: string;
  marking: MarkingUpdateInput;
}
