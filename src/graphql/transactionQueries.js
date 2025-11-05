import { gql } from "@apollo/client";

export const CREATE_REGISTERATION_FORM_TRANSACTION=gql`
mutation CreateTransaction($input:TransactionInput!) {
    createTransaction(input: $input) {
        id
        transaction_date
    }
}

`;