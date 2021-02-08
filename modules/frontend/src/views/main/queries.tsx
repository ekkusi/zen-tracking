import { gql } from "@apollo/client";
import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/user";

export const ADD_MARKING = gql`
  mutation addMarking($userName: ID!, $marking: MarkingInput!) {
    addMarking(userName: $userName, marking: $marking) {
      id
      date
      activities
      comment
    }
  }
`;

export type AddMarkingMutationResult = {
  addMarking: Marking;
};
