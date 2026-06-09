import { gql } from "@apollo/client";

export const CREATE_SUPPORT_TICKET=gql`
mutation CreateSupportTicket($input:CreateSupportTicketInput!) {
    createSupportTicket(input: $input) {
        id
        serial
        subject
        message
        type
        status
        admin_reply
        attachment
        admin_attachment
        payment_status
        has_fees
        createdAt
        updatedAt
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
            is_inside_yemen
            createdAt
            updatedAt
        }
    }
}
`;

export const GET_SUPPORT_TICKET_TYPES_CONFIG = gql`
query GetSupportTicketTypesConfig {
    getSupportTicketTypesConfig {
        type
        label_ar
        label_en
        requires_fee
        fees {
            id
            serial
            title_ar
            title_en
            inside_yemen_value
            outside_yemen_value
            createdAt
            updatedAt
            status
        }
    }
}
`;

export const GET_SUPPORT_TICKETS_BY_USER_ID=gql`
query GetSupportTicketsByUser($userId: ID!) {
    getSupportTicketsByUser(userId: $userId) {
        id
        serial
        subject
        message
        type
        status
        admin_reply
        createdAt
        updatedAt
            user_id {
            id
            serial
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
    }
}

`;

export const UPDATE_SUPPORT_TICKET_BY_ID=gql`
mutation UpdateSupportTicket($id:ID!,$input:UpdateSupportTicketInput!) {
    updateSupportTicket(id: $id, input: $input) {
        id
        serial
        subject
        message
        type
        status
        admin_reply
        createdAt
        updatedAt
    }
}
`;

export const GET_ALL_SUPPORT_TICKETS=gql`
query GetSupportTickets {
    getSupportTickets {
        id
        serial
        subject
        message
        type
        status
        admin_reply
        createdAt
        updatedAt
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
            is_inside_yemen
            createdAt
            updatedAt
        }
    }
}
`;

export const GET_SUPPORT_TICKET_BY_ID = gql`
query GetSupportTicketById($id: ID!) {
    getSupportTicketById(id: $id) {
        id
        serial
        subject
        message
        type
        status
        admin_reply
        attachment
        admin_attachment
        payment_status
        has_fees
        createdAt
        updatedAt
        fees {
            id
            serial
            title_ar
            title_en
            inside_yemen_value
            outside_yemen_value
            createdAt
            updatedAt
            status
        }
        transaction_id {
            id
            serial
            payment_method_type
            source_type
            amount
            payment_document_file
            approval_status
            rejection_reason
            transaction_date
            transaction_serial
            myfatoorah_invoice_id
            myfatoorah_payment_id
            myfatoorah_payment_url
            myfatoorah_transaction_status
            myfatoorah_payment_method
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
            is_inside_yemen
            createdAt
            updatedAt
        }
    }
}
`;