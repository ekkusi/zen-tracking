import { gql } from "@apollo/client";
import {
  activeParticipationInfoFragment,
  challengeDataFragment,
  participationInfoFragment,
  userDataFragment,
} from "fragments";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser($activeParticipationChallengeId: ID) {
    getCurrentUser {
      ...UserData
      activeParticipation(challengeId: $activeParticipationChallengeId) {
        ...ActiveParticipationInfo
      }
    }
  }
  ${userDataFragment}
  ${activeParticipationInfoFragment}
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const GET_CHALLENGES = gql`
  query GetChallenges($filters: ChallengeFilters) {
    getChallenges(filters: $filters) {
      ...ChallengeData
    }
  }
  ${challengeDataFragment}
`;

export const GET_PARTICIPATIONS = gql`
  query GetParticipations($filters: ParticipationFilters) {
    getParticipations(filters: $filters) {
      ...ParticipationInfo
    }
  }
  ${participationInfoFragment}
`;

export const GET_PARTICIPATION = gql`
  query GetParticipation($challengeId: ID!, $userName: ID!) {
    getParticipation(challengeId: $challengeId, userName: $userName) {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const GET_USER_TRANSFER_PARTICIPATION = gql`
  query GetUserTransferParticipation {
    getUserTransferParticipation {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
`;

export const GET_PARTICIPATIONS_PLAIN = gql`
  query GetParticipationsPlain($filters: ParticipationFilters) {
    getParticipations(filters: $filters) {
      id
      challenge {
        id
        name
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($name: ID!, $activeParticipationChallengeId: ID) {
    getUser(name: $name) {
      ...UserData
      activeParticipation(challengeId: $activeParticipationChallengeId) {
        ...ActiveParticipationInfo
      }
    }
  }
  ${userDataFragment}
  ${activeParticipationInfoFragment}
`;

export const ADD_FINISHED_CHALLENGE = gql`
  mutation AddFinishedChallenge($challengeId: ID!) {
    addFinishedChallenge(challengeId: $challengeId)
  }
`;
