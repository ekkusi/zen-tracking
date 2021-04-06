import { gql } from "@apollo/client";
import { markingDataFragment, userDataFragment } from "../../../fragments";

export const GET_WHOLE_PARTICIPATION = gql`
  query GetWholeParticipation($challengeId: ID!, $userName: ID!) {
    getParticipation(challengeId: $challengeId, userName: $userName) {
      id
      user {
        ...UserData
      }
      markings {
        ...MarkingData
      }
      challenge {
        id
        name
        status
        startDate
        endDate
        description
        creator {
          name
        }
      }
    }
  }
  ${userDataFragment}
  ${markingDataFragment}
`;
