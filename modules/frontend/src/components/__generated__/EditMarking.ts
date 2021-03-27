/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MarkingUpdateInput } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: EditMarking
// ====================================================

export interface EditMarking_editMarking {
  __typename: "Marking";
  id: string;
  date: any;
  comment: string | null;
  photoUrl: string | null;
  rating: number;
  isPrivate: boolean;
}

export interface EditMarking {
  editMarking: EditMarking_editMarking;
}

export interface EditMarkingVariables {
  id: string;
  marking: MarkingUpdateInput;
}
