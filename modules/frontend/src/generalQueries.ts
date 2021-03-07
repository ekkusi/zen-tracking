import { gql } from "@apollo/client";
import { userDataFragment } from "fragments";

export const GET_USER = gql`
  query GetUserQuery($name: ID!) {
    getUser(name: $name) {
      ...UserData
    }
  }
  ${userDataFragment}
`;
