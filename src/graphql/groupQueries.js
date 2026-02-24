import { gql } from "@apollo/client";

/* 🟩 1. Queries */
export const GET_SCREENS = gql`
query AvailablePermissions {
    availablePermissions {
           module
        label_ar
        label_en
         permissions {
            key
            action
        }
    }
}

`;
export const GET_GROUPS = gql`
query Groups {
    groups {
        id
        name_ar
        name_en
        permissions
        createdAt
        updatedAt
    }
}

`;


export const GET_GROUP_BY_ID = gql`
  query Groups($id: ID!) {
    group(id: $id) {
      id
        name_ar
        name_en
        permissions
        createdAt
        updatedAt
    }
  }
`;

// login 
export const CREATE_GROUP = gql`
mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
          id
        name_ar
        name_en
        permissions
        createdAt
        updatedAt
    }
}
`;
export const UPDATE_GROUP = gql`
mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {
    updateGroup(id: $id, input: $input) {
          id
        name_ar
        name_en
        permissions
        createdAt
        updatedAt
    }
}
`;




