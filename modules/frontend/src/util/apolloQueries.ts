import { ApolloQueryResult } from "@apollo/client";
import { initializeApollo } from "../apollo/ApolloProvider";
import { GET_PARTICIPATION, GET_USER } from "../generalQueries";
import {
  GetParticipation,
  GetParticipationVariables,
} from "../__generated__/GetParticipation";
import { GetUser, GetUserVariables } from "../__generated__/GetUser";

// NOTE! If making query here, initialize client inside query.
// Otherwise client will get initialized, before it has links set from ApolloProvider

export const getParticipation = async (
  variables: GetParticipationVariables
): Promise<ApolloQueryResult<GetParticipation>> => {
  const client = initializeApollo();
  return client.query<GetParticipation, GetParticipationVariables>({
    query: GET_PARTICIPATION,
    variables,
  });
};

export const getUser = async (
  variables: GetUserVariables
): Promise<ApolloQueryResult<GetUser>> => {
  const client = initializeApollo();
  return client.query<GetUser, GetUserVariables>({
    query: GET_USER,
    variables,
  });
};
