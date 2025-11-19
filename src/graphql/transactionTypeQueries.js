import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTION_TYPES=gql`
query GetTransactionTypes {
    getTransactionTypes {
        id
        operation_type
        notes
        status
        createdAt
        updatedAt
    }
}
`;