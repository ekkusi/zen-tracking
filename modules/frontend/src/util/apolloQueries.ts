import { ApolloQueryResult, FetchResult } from "@apollo/client";
import { initializeApollo } from "../apollo/ApolloProvider";
import {
  ADD_FINISHED_PARTICIPATION,
  GET_PARTICIPATION,
  GET_USER,
} from "../generalQueries";
import {
  AddFinishedParticipation,
  AddFinishedParticipationVariables,
} from "../__generated__/AddFinishedParticipation";
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

export const addFinishedParticipation = async (
  variables: AddFinishedParticipationVariables
): Promise<FetchResult<AddFinishedParticipation>> => {
  const client = initializeApollo();
  return client.mutate<
    AddFinishedParticipation,
    AddFinishedParticipationVariables
  >({
    mutation: ADD_FINISHED_PARTICIPATION,
    variables,
  });
};
