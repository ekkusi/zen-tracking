import { gql } from "@apollo/client";
import { Marking, User } from "@ekeukko/zen-tracking-backend/lib/types/user";

export const GET_USER = gql`
  query getUser($name: ID!) {
    getUser(name: $name) {
      name
      markings {
        date
        activities
        comment
      }
    }
  }
`;

export type GetUserQueryResult = {
  getUser: User;
};

export const ADD_MARKING = gql`
  mutation addMarking($userName: ID!, $marking: MarkingInput!) {
    addMarking(userName: $userName, marking: $marking) {
      id
    }
  }
`;

export type AddMarkingMutationResult = {
  addMarking: Marking;
};
