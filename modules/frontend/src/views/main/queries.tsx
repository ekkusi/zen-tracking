import { gql } from "@apollo/client";
import { markingDataFragment } from "fragments";

export const ADD_MARKING = gql`
  mutation AddMarkingMutation($participationId: ID!, $marking: MarkingInput!) {
    addMarking(participationId: $participationId, marking: $marking) {
      ...MarkingData
    }
  }
  ${markingDataFragment}
`;

export const EDIT_MARKING = gql`
  mutation EditMarkingMutation($id: ID!, $marking: MarkingInput!) {
    editMarking(id: $id, marking: $marking) {
      ...MarkingData
    }
  }
  ${markingDataFragment}
`;

export const DELETE_MARKING = gql`
  mutation DeleteMarkingMutation($id: ID!) {
    deleteMarking(id: $id)
  }
`;
