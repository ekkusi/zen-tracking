import { gql } from "@apollo/client";
import { UserCheckResult } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { userDataFragment } from "fragments";

export const CHECK_USER = gql`
  query checkUser($name: ID!, $password: String!) {
    checkUser(name: $name, password: $password) {
      status
      user {
        ...UserData
      }
    }
  }
  ${userDataFragment}
`;
