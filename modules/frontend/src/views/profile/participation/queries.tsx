import { gql } from "@apollo/client";
import {
  markingDataFragment,
  userDataFragment,
  participationInfoFragment,
  challengeDataFragment,
} from "../../../fragments";

export const GET_WHOLE_PARTICIPATION = gql`
  query GetWholeParticipation($id: ID!) {
    getParticipation(id: $id) {
      id
      ...ParticipationInfo
      user {
        ...UserData
      }
      markings {
        ...MarkingData
      }
      challenge {
        ...ChallengeData
      }
    }
  }
  ${participationInfoFragment}
  ${userDataFragment}
  ${markingDataFragment}
  ${challengeDataFragment}
`;
