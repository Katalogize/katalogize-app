import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, Observable } from '@apollo/client';

//LOCAL URL
const url = 'http://localhost:8080/graphql';

//PROD URL
// const url = 'http://api.katalogize.com/graphql';

const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken (refreshToken: $refreshToken) {
      accessToken,
      refreshToken,
      userId,
      username,
      email,
      isAdmin
    }
  }
`;

const LOG_OUT = gql`
  mutation LogOut($userId: String!) {
    logOut (userId: $userId)
  }
`;

localStorage.setItem('isLocked', 0);

export const httpLink = createHttpLink({
  uri: url,
});

export const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch(err.extensions.classification) {
          case 'UNAUTHORIZED':
            //Refresh Token
            return new Observable(observer => {
              refreshAuthToken().then(() => {
                const token = localStorage.getItem('accessToken');
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : "",
                  }
                }));
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                return forward(operation).subscribe(subscriber);
              });
            });
            // break;
          default:
            console.log("Default error");
        }
      }
    }
  }
)

function waitLock(resolve) {
  setTimeout(() => {
    // eslint-disable-next-line
    if(localStorage.getItem('isLocked') == 1) {
      waitLock(resolve)
    }else{
      resolve(true);
    }
  },100);
}

function refreshAuthToken () {
  // eslint-disable-next-line
  if (localStorage.getItem('isLocked') == 1) {
    return new Promise((resolve) => {
      waitLock(resolve);
    });
  }
  localStorage.setItem('isLocked', 1);
  const refreshToken = localStorage.getItem('refreshToken');
  return client.mutate({
    mutation: REFRESH_TOKEN,
    variables: { refreshToken }
  })
  .then(response => {
    localStorage.setItem("accessToken", response.data.refreshToken.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken.refreshToken);
    localStorage.setItem("userId", response.data.refreshToken.userId);
    localStorage.setItem('isLocked', 0);
    return true;
  })
  .catch(error => {
    localStorage.setItem('isLocked', 0);
    const userId = localStorage.getItem('userId');
    if (userId) {
      client.mutate({
        mutation: LOG_OUT,
        variables: { userId }
      })
    }
    localStorage.clear();
    if (window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      window.location.replace(window.location.origin + '/login');
    }
    return false;
  })
  
}

export const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
          fetchPolicy: 'network-only'
      },
      watchQuery: { fetchPolicy: "no-cache" },
    }
  });
