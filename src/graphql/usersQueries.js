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

export const GET_LOGGED_USER_BY_TOKEN=gql`
query Me {
    me {
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


export const GET_USER_REQUIRED_FEES_BY_STUDENT_ID=gql`
query GetUsersRequiredFeesByStudent($student_id: ID!) {
    getUsersRequiredFeesByStudent(student_id: $student_id) {
        is_inside_yemen
        required_fees {
            id
            is_paid
            title_en
            title_ar
            description_en
            description_ar
            createdAt
            updatedAt
            student_id {
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
            website_user_id {
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
            fees_types_ids {
                id
                title_ar
                title_en
                inside_yemen_value
                outside_yemen_value
                createdAt
                updatedAt
            }
            transactions_id {
                id
                payment_method_type
                transaction_type_id
                user_id
                fees_type_ids
                transaction_date
            }
        }
    }
}

`;


