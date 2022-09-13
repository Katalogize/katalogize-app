import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { gql } from '@apollo/client';

const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken (refreshToken: $refreshToken) {
      accessToken,
      refreshToken,
      userId,
      username,
      email,
      roles
    }
  }
`;

// DEV config
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

//PROD config
// const httpLink = createHttpLink({
//   uri: 'https://api.katalogize.com/graphql',
// });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const errorLink = onError(
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
            })});
          default:
            console.log("Default error");
        }
      }
    }
  }
)

function refreshAuthToken () {
  const refreshToken = localStorage.getItem('refreshToken');
  return client.mutate({
    mutation: REFRESH_TOKEN,
    variables: { refreshToken }
  })
  .then(response => {
    localStorage.setItem("accessToken", response.data.refreshToken.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken.refreshToken);
    return true;
  })
  .catch(error => {
    console.log(error)
    localStorage.clear();
    //Redirect to login page
    // window.location.reload();
    return false;
  })
}

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
