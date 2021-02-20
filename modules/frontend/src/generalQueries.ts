import { gql } from "@apollo/client";
import { User } from "@ekeukko/zen-tracking-backend/lib/types/user";

const markingDataFragment = gql`
  fragment MarkingData on Marking {
    id
    date
    comment
  }
`;

const userDataFragment = gql`
  fragment UserData on User {
    name
    isPrivate
    markings {
      ...MarkingData
    }
  }
  ${markingDataFragment}
`;

export const fragments = {
  markingData: markingDataFragment,
  userData: userDataFragment,
};

export const GET_USER = gql`
  query getUser($name: ID!) {
    getUser(name: $name) {
      ...UserData
    }
  }
  ${fragments.userData}
`;

export type GetUserQueryResult = {
  getUser: User;
};
