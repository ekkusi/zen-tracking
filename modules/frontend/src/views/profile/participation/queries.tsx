import { gql } from "@apollo/client";
import {
  markingDataFragment,
  userDataFragment,
  participationInfoFragment,
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
        id
        name
        status
        startDate
        endDate
        description
        creator {
          name
        }
        participations {
          id
          user {
            name
          }
        }
      }
    }
  }
  ${participationInfoFragment}
  ${userDataFragment}
  ${markingDataFragment}
`;
