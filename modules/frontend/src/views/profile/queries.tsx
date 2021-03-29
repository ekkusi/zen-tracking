import { gql } from "@apollo/client";
import { participationInfoFragment, userDataFragment } from "../../fragments";

export const GET_USER_WITH_PARTICIPATIONS = gql`
  query GetUserWithParticipations($userName: ID!) {
    getUser(name: $userName) {
      ...UserData
      participations {
        ...ParticipationInfo
      }
    }
  }
  ${userDataFragment}
  ${participationInfoFragment}
`;
