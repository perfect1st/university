import { gql } from "@apollo/client";

export const CREATE_REGISTERATION_FORM_TRANSACTION=gql`
mutation CreateTransaction($input:TransactionInput!) {
    createTransaction(input: $input) {
        id
        payment_method_type
        transaction_type_id
        user_id
        fees_type_ids
        transaction_date
    }
}

`;