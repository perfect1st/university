import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTION_TYPES = gql`
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

export const GET_ALL_TRANSACTION_TYPES_FILTERED = gql`
query GetTransactionTypesFiltered(
    $limit: Int!
    $page: Int!
    $operation_type: String
    $search: String
    $status: Boolean
) {
    getTransactionTypesFiltered(
        search: $search
        operation_type: $operation_type
        status: $status
        page: $page
        limit: $limit
    ) {
        total
        transactionTypes {
            id
            serial
            title_ar
            title_en
            operation_type
            notes
            status
            createdAt
            updatedAt
        }
    }
}
`;
export const CREATE_TRANSACTION_TYPE = gql`
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

export const UPDATE_TRANSACTION_TYPE = gql`
mutation UpdateTransactionType($id:ID!,$input:TransactionTypeInput!) {
    updateTransactionType(id: $id, input: $input) {
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