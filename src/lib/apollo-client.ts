import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const TOKEN_KEY = 'tms_token';

const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(
    new HttpLink({
      uri: 'localhost:7265/graphql',
      credentials: 'include',
    }),
  ),
  cache: new InMemoryCache(),
});

export default client;
