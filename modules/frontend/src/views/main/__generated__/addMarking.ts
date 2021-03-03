/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MarkingInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: addMarking
// ====================================================

export interface addMarking_addMarking {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
}

export interface addMarking {
  addMarking: addMarking_addMarking;
}

export interface addMarkingVariables {
  userName: string;
  marking: MarkingInput;
}
