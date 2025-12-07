import { gql } from "@apollo/client";

export const GET_ALL_USERES_FOR_ADMIN=gql`
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

export const CREATE_USER_BY_ADMIN=gql`
mutation CreateUser($input: AdminCreateUserInput!) {
    createUser(input: $input) {
        id
        username
        fullname
        email
        mobile
        role
        status
        profile_image
        qid_number
        is_inside_yemen
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_USER_BY_ADMIN=gql`
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
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