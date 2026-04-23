// src/apolloClient.js
import { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { getToken, getUserCookie } from "../hooks/authCookies";
import logger from "../utils/logger";

export const baseURL="https://uas.edu.ye";
// http://server.perfect1st.com:4000/graphql

const httpLink = new HttpLink({ uri: `${baseURL}/graphql` });

// هنا بنضيف الـ Authorization Header قبل كل request
const authLink = new ApolloLink((operation, forward) => {
  const token = getToken();

  logger.log('token',token);

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}`: "",
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
   link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;





