/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MarkingInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: editMarking
// ====================================================

export interface editMarking_editMarking {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
}

export interface editMarking {
  editMarking: editMarking_editMarking;
}

export interface editMarkingVariables {
  id: string;
  marking: MarkingInput;
}
