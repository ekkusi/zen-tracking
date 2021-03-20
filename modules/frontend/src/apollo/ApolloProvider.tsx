import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "@apollo/link-error";
import useGlobal from "store";

const isProduction = process.env.NODE_ENV === "production";

let apolloClient: ApolloClient<NormalizedCacheObject>;
let errorLinkIsSet: boolean | undefined;

// If you want to definre custom graphql api url, like for running only frontend in netlify -> put it to REACT_APP_GRAPHQL_API env variable
const backendApiBase = process.env.REACT_APP_BACKEND_API_BASE_URL;
const graphqlApiUrlIfExists = backendApiBase && `${backendApiBase}/graphql`;
const graphqlApiUrl =
  graphqlApiUrlIfExists ??
  (isProduction ? "/graphql" : "http://localhost:4000/graphql");

const createApolloClient = (errorLink?: ApolloLink) => {
  const httpLink = new HttpLink({
    uri: graphqlApiUrl,
  });

  const link = errorLink ? ApolloLink.from([errorLink, httpLink]) : httpLink;

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        ChallengeParticipation: {
          keyFields: ["id"],
        },
      },
    }),
  });

  apolloClient = client; // Update general client

  return client;
};

// Returns apollo client, can be used outside React components to make queries
// Error link can only be defined in React component, hence it is passed as optional prop
// If you want to use client, just call initializeApollo()
export const initializeApollo = (errorLink?: ApolloLink) => {
  // Create new client if one is not defined or it doesn't have errorLink set (tracked by errorLinkIsSet), but one is passed in props
  // If client is defined but errorLink is passed, create new client so other than Provider will also have new errorLink defined
  // If client is defined and errorLink is set, simply return already created client, no need to make another one
  if (!apolloClient || (errorLinkIsSet === undefined && errorLink)) {
    errorLinkIsSet = errorLink ? true : undefined;
    const newApolloClient = createApolloClient(errorLink);
    return newApolloClient;
  }

  return apolloClient;
};

const CustomApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [globalError, setGlobalError] = useGlobal(
    (state) => state.error,
    (actions) => actions.updateError
  );
  const errorLink = onError(({ networkError, graphQLErrors }) => {
    let settingGlobalError = false; // Need this for networkError if check, because setGlobalError is not triggered instantly
    if (
      graphQLErrors &&
      graphQLErrors.length > 0 &&
      !settingGlobalError &&
      !globalError
    ) {
      settingGlobalError = true;

      setGlobalError(graphQLErrors[0].message);
    }

    // If globalError is not yet set and networkError is returned, set this as global error
    if (networkError && !globalError && !settingGlobalError) {
      setGlobalError(
        `Jotakin meni vikaan tietojesi hakemisessa. Kokeile kirjautua uudestaan. Mikäli tämä virheviesti esiintyy uudelleen, ota yhteyttä ekeukkoon!`
      );
    }
  });

  // Pass errorLink to ApolloClient initialization to create new client with one.
  const client = initializeApollo(errorLink);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default CustomApolloProvider;
