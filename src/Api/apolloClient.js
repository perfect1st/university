// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const baseURL="http://server.perfect1st.com:4000";
// http://server.perfect1st.com:4000/graphql
const client = new ApolloClient({
  link: new HttpLink({
    uri: `${baseURL}/graphql`, // غيّرها حسب سيرفرك
  }),
  cache: new InMemoryCache(),
});

export default client;





