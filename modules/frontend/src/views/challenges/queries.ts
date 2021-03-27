import { gql } from "@apollo/client";
import {
  activeParticipationInfoFragment,
  challengeDataFragment,
} from "fragments";

export const challengeWithParticipationsFragment = gql`
  fragment ChallengeWithParticipations on Challenge {
    ...ChallengeData
    participations {
      id
      user {
        name
      }
    }
  }
  ${challengeDataFragment}
`;

export const GET_CHALLENGES = gql`
  query GetChallenges {
    getChallenges {
      ...ChallengeWithParticipations
    }
  }
  ${challengeWithParticipationsFragment}
`;

export const CREATE_PARTICIPATION = gql`
  mutation CreateParticipation($challengeId: ID!) {
    createParticipation(challengeId: $challengeId) {
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
