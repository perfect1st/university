import { gql } from "@apollo/client";

export const CREATE_REGISTERATION_FORM_TRANSACTION=gql`
mutation CreateTransaction($input:TransactionInput!) {
    createTransaction(input: $input) {
        id
        transaction_date
    }
}

`;

export const GET_ALL_TRANSACTIONS=gql`
query GetTransactions {
    getTransactions {
        id
        payment_method_type
        amount
        payment_document_file
        transaction_date
        transaction_serial
        user_id {
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
}
`;

export const GET_TRANSACTION_BY_ID=gql`
query GetTransactionById($id:ID!) {
    getTransactionById(id: $id) {
        id
        payment_method_type
        amount
        payment_document_file
        transaction_date
        transaction_serial
        fees_type_ids {
            id
            title_ar
            title_en
            inside_yemen_value
            outside_yemen_value
            createdAt
            updatedAt
            status
        }
        transaction_type_id {
            id
            operation_type
            notes
            status
            createdAt
            updatedAt
        }
        user_id {
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
}
`;

export const CREATE_NEW_TRANSACTION_BY_ADMIN=gql`
mutation CreateTransaction($input:TransactionInput!) {
    createTransaction(input: $input) {
        id
        payment_method_type
        amount
        payment_document_file
        transaction_date
        transaction_serial
    }
}
`;

export const UPDATE_TRANSACTION_BY_ID=gql`
mutation UpdateTransaction($id:ID!,$input:TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
        id
        payment_method_type
        amount
        payment_document_file
        transaction_date
        transaction_serial
    }
}
`;