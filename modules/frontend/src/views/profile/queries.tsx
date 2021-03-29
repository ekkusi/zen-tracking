import { gql } from "@apollo/client";
import { challengeDataFragment } from "../../fragments";

export const GET_USER_CHALLENGES = gql`
  query GetUserChallenges($userName: ID!) {
    getChallenges(creatorName: $userName) {
      ...ChallengeData
    }
  }
  ${challengeDataFragment}
`;
