import { gql } from "@apollo/client";
import { userDataFragment, markingDataFragment } from "fragments";

export const CHECK_USER = gql`
  query CheckUserQuery($name: ID!, $password: String!) {
    checkUser(name: $name, password: $password) {
      status
      user {
        ...UserData
      }
    }
  }
  ${userDataFragment}
`;

export const GET_USER_PARTICIPATIONS = gql`
  query GetUserParticipationsQuery($userName: ID!) {
    getUserParticipations(userName: $userName) {
      id
      challenge {
        id
        name
      }
      markings {
        ...MarkingData
      }
    }
  }
  ${markingDataFragment}
`;
