import { gql } from "@apollo/client";
import { challengeDataFragment } from "fragments";

export const GET_CHALLENGES = gql`
  query GetChallengesQuery {
    getChallenges {
      ...ChallengeData
      participations {
        id
      }
    }
  }
  ${challengeDataFragment}
`;
