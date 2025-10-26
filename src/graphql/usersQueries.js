import { gql } from "@apollo/client";

/* 🟩 1. Queries */
export const GET_USERS = gql`
  query Users {
  users {
    id
    username
    fullname
    email
    mobile
    role
    status
    profile_image
    qid_number
    createdAt
    updatedAt
  }
}
`;


export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      fullname
      email
      mobile
      role
      status
      profile_image
      qid_number
      createdAt
      updatedAt
    }
  }
`;

// login 
export const LOGIN_USER=gql`
mutation Login($input: LoginInput!) {
    login(input: $input) {
        token
    }
}
`;






