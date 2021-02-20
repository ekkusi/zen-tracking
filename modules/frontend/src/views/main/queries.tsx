import { gql } from "@apollo/client";
import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { fragments } from "generalQueries";

export const ADD_MARKING = gql`
  mutation addMarking($userName: ID!, $marking: MarkingInput!) {
    addMarking(userName: $userName, marking: $marking) {
      ...MarkingData
    }
  }
  ${fragments.markingData}
`;

export type AddMarkingMutationResult = {
  addMarking: Marking;
};

export const EDIT_MARKING = gql`
  mutation editMarking($id: ID!, $marking: MarkingInput!) {
    editMarking(id: $id, marking: $marking) {
      ...MarkingData
    }
  }
  ${fragments.markingData}
`;

export type EditMarkingMutationResult = {
  editMarking: Marking;
};

export const DELETE_MARKING = gql`
  mutation deleteMarking($id: ID!) {
    deleteMarking(id: $id)
  }
`;

export type DeleteMarkingMutationResult = {
  deleteMarking: boolean;
};
