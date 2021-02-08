import { gql } from "@apollo/client";
import { User } from "@ekeukko/zen-tracking-backend/lib/types/user";

export const fragments = {
  userData: gql`
    fragment UserData on User {
      name
      isPrivate
      markings {
        id
        date
        activities
        comment
      }
    }
  `,
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
