/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MarkingCreateInput } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: AddMarking
// ====================================================

export interface AddMarking_addMarking {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
}

export interface AddMarking {
  addMarking: AddMarking_addMarking;
}

export interface AddMarkingVariables {
  participationId: string;
  marking: MarkingCreateInput;
}
