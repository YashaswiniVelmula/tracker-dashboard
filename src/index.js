import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
    // uri: "http://localhost:4000/graphql",
    uri: "http://graphql-server-crime-records-env.eba-epefitaj.us-east-1.elasticbeanstalk.com/graphql", //backend link, check backend console for link

});

export const wsClient = createClient({
    // url: "ws://localhost:4000/graphql",
    url: "ws://graphql-server-crime-records-env.eba-epefitaj.us-east-1.elasticbeanstalk.com/graphql", // backend link, check backend console for link
  });

// setting configuration for websocket connect for subscription
const wsLink = new GraphQLWsLink(wsClient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, 
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(), // for in memory caching of data
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
