// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://server.perfect1st.com:4000/graphql", // غيّرها حسب سيرفرك
  }),
  cache: new InMemoryCache(),
});

export default client;





