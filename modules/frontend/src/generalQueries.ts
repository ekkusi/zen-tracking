import { gql } from "@apollo/client";
import { User } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { userDataFragment } from "fragments";

export const GET_USER = gql`
  query getUser($name: ID!) {
    getUser(name: $name) {
      ...UserData
    }
  }
  ${userDataFragment}
`;
