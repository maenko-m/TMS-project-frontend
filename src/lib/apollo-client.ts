import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const TOKEN_KEY = 'tms_token';

// 🔍 Обработка ошибок
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error('[GraphQL error]', { message, locations, path });
    });
  }
  if (networkError) {
    console.error('[Network error]', networkError);
  }
});

// 🔐 Авторизация (опционально)
const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }));
  return forward(operation);
});

// 🌐 Http-ссылка
const httpLink = new HttpLink({
  uri: 'http://localhost:7265/graphql',
});

// 🎯 ApolloClient с ошибками и авторизацией
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
