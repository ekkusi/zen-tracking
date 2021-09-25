import { gql } from "@apollo/client";
import {
  activeParticipationInfoFragment,
  userDataFragment,
} from "../../fragments";

export const LOGIN = gql`
  mutation Login($name: ID!, $password: String!, $activeParticipationId: ID) {
    login(name: $name, password: $password) {
      accessToken
      user {
        ...UserData
        activeParticipation(id: $activeParticipationId) {
          ...ActiveParticipationInfo
        }
      }
    }
  }
  ${userDataFragment}
  ${activeParticipationInfoFragment}
`;
