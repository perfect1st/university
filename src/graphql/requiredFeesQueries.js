import { gql } from "@apollo/client";

export const GET_USERS_REQUIRED_FEES=gql`
query GetUsersRequiredFees {
    getUsersRequiredFees {
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
            is_inside_yemen
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
            is_inside_yemen
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
            status
        }
        transactions_id {
            id
            payment_method_type
            amount
            payment_document_file
            transaction_date
            transaction_serial
        }
    }
}
`;

export const CREATE_USER_REQUIRED_FEES=gql`
mutation CreateUsersRequiredFees($input:UsersRequiredFeesInput!) {
    createUsersRequiredFees(input: $input) {
        id
        is_paid
        title_en
        title_ar
        description_en
        description_ar
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_USER_REQUIRED_FEES=gql`
mutation UpdateUsersRequiredFees($id:ID!,$input:UsersRequiredFeesInput!) {
    updateUsersRequiredFees(id: $id, input: $input) {
        id
        is_paid
        title_en
        title_ar
        description_en
        description_ar
        createdAt
        updatedAt
    }
}
`;