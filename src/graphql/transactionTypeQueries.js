import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTION_TYPES=gql`
query GetTransactionTypes {
    getTransactionTypes {
        id
        title_ar
        title_en
        operation_type
        notes
        status
        createdAt
        updatedAt
    }
}
`;

export const CREATE_TRANSACTION_TYPE=gql`
mutation CreateTransactionType($input:TransactionTypeInput!) {
    createTransactionType(input: $input) {
        id
        title_ar
        title_en
        operation_type
        notes
        status
        createdAt
        updatedAt
    }
}
`;