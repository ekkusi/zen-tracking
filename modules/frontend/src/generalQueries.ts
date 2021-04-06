import { gql } from "@apollo/client";
import {
  activeParticipationInfoFragment,
  challengeDataFragment,
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
  query GetChallenges(
    $status: ChallengeStatus
    $startDate: DateFilter
    $endDate: DateFilter
    $creatorName: ID
  ) {
    getChallenges(
      status: $status
      startDate: $startDate
      endDate: $endDate
      creatorName: $creatorName
    ) {
      ...ChallengeData
    }
  }
  ${challengeDataFragment}
`;

export const GET_USER_PARTICIPATIONS = gql`
  query GetUserParticipations {
    getUserParticipations {
      ...ActiveParticipationInfo
    }
  }
  ${activeParticipationInfoFragment}
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

export const GET_USER_PARTICIPATIONS_PLAIN = gql`
  query GetUserParticipationsPlain {
    getUserParticipations {
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
