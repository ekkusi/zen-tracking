import { gql } from "@apollo/client";
import { challengeDataFragment } from "fragments";

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
