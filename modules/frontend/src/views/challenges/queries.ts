import { gql } from "@apollo/client";
import { challengeDataFragment } from "fragments";

export const GET_CHALLENGES = gql`
  query GetChallengesQuery {
    getChallenges {
      ...ChallengeData
      participations {
        id
        user {
          name
        }
      }
    }
  }
  ${challengeDataFragment}
`;

export const CREATE_PARTICIPATION = gql`
  mutation CreateParticipationMutation($challengeId: ID!, $userName: ID!) {
    createParticipation(challengeId: $challengeId, userName: $userName) {
      id
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
      id
    }
  }
`;

export const UPDATE_CHALLENGE = gql`
  mutation UpdateChallengeMutation($id: ID!, $args: UpdateChallengeInput!) {
    updateChallenge(id: $id, args: $args) {
      id
    }
  }
`;

export const DELETE_CHALLENGE = gql`
  mutation DeleteChallengeMutation($id: ID!) {
    deleteChallenge(id: $id)
  }
`;
