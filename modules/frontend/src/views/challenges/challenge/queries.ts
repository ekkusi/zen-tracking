import { gql } from "@apollo/client";
import {
  activeParticipationInfoFragment,
  challengeDataFragment,
} from "../../../fragments";

export const GET_CHALLENGE = gql`
  query GetChallenge($id: ID!) {
    getChallenge(id: $id) {
      ...ChallengeData
    }
  }
  ${challengeDataFragment}
`;

export const CREATE_PARTICIPATION = gql`
  mutation CreateParticipation($challengeId: ID!, $isPrivate: Boolean!) {
    createParticipation(challengeId: $challengeId, isPrivate: $isPrivate) {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const DELETE_PARTICIPATION = gql`
  mutation DeleteParticipation($challengeId: ID!) {
    deleteParticipation(challengeId: $challengeId)
  }
`;
