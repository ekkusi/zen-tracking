import { gql } from "@apollo/client";
import { challengeDataFragment } from "fragments";

export const challengeWithParticipationsFragment = gql`
  fragment ChallengeWithParticipationsFragment on Challenge {
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
  query GetChallengesQuery {
    getChallenges {
      ...ChallengeWithParticipationsFragment
    }
  }
  ${challengeWithParticipationsFragment}
`;

export const CREATE_PARTICIPATION = gql`
  mutation CreateParticipationMutation($challengeId: ID!) {
    createParticipation(challengeId: $challengeId) {
      id
      challenge {
        id
      }
    }
  }
`;

export const DELETE_PARTICIPATION = gql`
  mutation DeteleParticipationMutation($challengeId: ID!) {
    deleteParticipation(challengeId: $challengeId)
  }
`;
