import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/link-error";
import useGlobal from "store";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import {
  DecodedTokenType,
  getAccessToken,
  setAccessToken,
} from "../util/accessToken";

const isProduction = process.env.NODE_ENV === "production";

let apolloClient: ApolloClient<NormalizedCacheObject>;
let additionalLinksAreSet: boolean | undefined;

// If you want to definre custom graphql api url, like for running only frontend in netlify -> put it to REACT_APP_GRAPHQL_API env variable
const backendApiBase = process.env.REACT_APP_BACKEND_API_BASE_URL;
const graphqlApiUrlIfExists = backendApiBase && `${backendApiBase}/graphql`;
const graphqlApiUrl =
  graphqlApiUrlIfExists ??
  (isProduction ? "/graphql" : "http://localhost:4000/graphql");

const createApolloClient = (additionalLinks?: ApolloLink) => {
  const httpLink = new HttpLink({
    uri: graphqlApiUrl,
    credentials: "include",
  });

  const link = additionalLinks
    ? ApolloLink.from([additionalLinks, httpLink])
    : httpLink;

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
export const initializeApollo = (additionalLinks?: ApolloLink) => {
  // Create new client if one is not defined or it doesn't have additionalLinks set (tracked by additionalLinksareSet), but one is passed in props
  // If client is defined but additionalLinks is passed, create new client so other than Provider will also have new additionalLinks defined
  // If client is defined and additionalLinks is set, simply return already created client, no need to make another one
  if (
    !apolloClient ||
    (additionalLinksAreSet === undefined && additionalLinks)
  ) {
    additionalLinksAreSet = additionalLinks ? true : undefined;
    const newApolloClient = createApolloClient(additionalLinks);
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

  const history = useHistory();

  const refreshTokenLink = new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: () => {
      const accessToken = getAccessToken();
      if (!accessToken) return true;
      try {
        const { exp } = jwtDecode<DecodedTokenType>(accessToken);
        if (Date.now() >= exp * 1000) {
          return false;
        }
      } catch (error) {
        return false;
      }
      return true;
    },
    fetchAccessToken: () => {
      return fetch(`${backendApiBase ?? ""}/delete-image`, {
        method: "POST",
        credentials: "include",
      });
    },
    handleFetch: (accessToken: string) => {
      setAccessToken(accessToken);
    },
    handleError: (err) => {
      console.warn("token refresh err ", err);
    },
  });

  const authLink = setContext(async (_, { headers }) => {
    const accessToken = getAccessToken();
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    };
  });

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    let settingGlobalError = false; // Need this for networkError if check, because setGlobalError is not triggered instantly
    if (
      graphQLErrors &&
      graphQLErrors.length > 0 &&
      !settingGlobalError &&
      !globalError
    ) {
      settingGlobalError = true;

      // If there is no UNAUTHENTICATED error in errors, throw error from the first message, otherwise handle below
      if (
        !graphQLErrors.some(
          (it) => it.extensions && it.extensions.code === "UNAUTHENTICATED"
        )
      ) {
        setGlobalError(graphQLErrors[0].message);
      } else {
        for (const err of graphQLErrors) {
          if (err.extensions && err.extensions.code === "UNAUTHENTICATED") {
            setGlobalError(
              "Kirjautumistietosi ovat vanhentuneet. Kirjaudu sisään uudestaan."
            );
            history.push("/login");
          }
        }
      }
    }

    // If globalError is not yet set and networkError is returned, set this as global error
    if (networkError && !globalError && !settingGlobalError) {
      setGlobalError(
        `Jotakin meni vikaan tietojesi hakemisessa. Kokeile kirjautua uudestaan. Mikäli tämä virheviesti esiintyy uudelleen, ota yhteyttä ekeukkoon!`
      );
    }
  });

  const links = ApolloLink.from([refreshTokenLink, authLink, errorLink]);

  // Pass additionalLinks to ApolloClient initialization to create new client with one.
  const client = initializeApollo(links);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default CustomApolloProvider;
