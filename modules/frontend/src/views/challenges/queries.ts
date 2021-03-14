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
  mutation CreateParticipationMutation($challengeId: ID!, $userName: ID!) {
    createParticipation(challengeId: $challengeId, userName: $userName) {
      id
      challenge {
        id
      }
    }
  }
`;

export const DELETE_PARTICIPATION = gql`
  mutation DeteleParticipationMutation($challengeId: ID!, $userName: ID!) {
    deleteParticipation(challengeId: $challengeId, userName: $userName)
  }
`;

export const CREATE_CHALLENGE = gql`
  mutation CreateChallengeMutation($challenge: CreateChallengeInput!) {
    createChallenge(challenge: $challenge) {
      ...ChallengeWithParticipationsFragment
    }
  }
  ${challengeWithParticipationsFragment}
`;

export const UPDATE_CHALLENGE = gql`
  mutation UpdateChallengeMutation($id: ID!, $args: UpdateChallengeInput!) {
    updateChallenge(id: $id, args: $args) {
      ...ChallengeWithParticipationsFragment
    }
  }
  ${challengeWithParticipationsFragment}
`;

export const DELETE_CHALLENGE = gql`
  mutation DeleteChallengeMutation($id: ID!) {
    deleteChallenge(id: $id)
  }
`;
