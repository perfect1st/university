import { gql } from "@apollo/client";

export const CREATE_REGISTERATION_FORM_TRANSACTION=gql`
mutation CreateTransaction($input:TransactionInput!) {
    createTransaction(input: $input) {
        id
        transaction_date
    }
}

`;

// export const GET_ALL_TRANSACTIONS=gql`
// `;

export const CREATE_NEW_TRANSACTION=gql`
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