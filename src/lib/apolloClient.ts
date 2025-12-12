import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

export function createApolloClient(token?: string) {
  const httpLink = new HttpLink({
    uri: "http://localhost:3000/api/graphql",
  });

  const authLink = new ApolloLink((operation, forward) => {
    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return forward(operation);
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            recipes: {
              merge(existing = [], incoming: any[]) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
}
