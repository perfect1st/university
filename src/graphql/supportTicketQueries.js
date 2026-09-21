import { gql } from "@apollo/client";

export const CREATE_SUPPORT_TICKET=gql`
mutation CreateSupportTicket($input:CreateSupportTicketInput!) {
    createSupportTicket(input: $input) {
        id
        serial
        subject
        message
        type
        ticket_type_id {
            id
            label_ar
            label_en
            requires_fee
        }
        status
        admin_reply
        attachment
        admin_attachment
        payment_status
        has_fees
        fee_amount
        installment_id {
            id
            amount
            status
            is_paid
        }
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
        id
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
        ticket_type_id {
            id
            label_ar
            label_en
            requires_fee
        }
        status
        admin_reply
        attachment
        admin_attachment
        payment_status
        has_fees
        fee_amount
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
        ticket_type_id {
            id
            label_ar
            label_en
            requires_fee
        }
        status
        admin_reply
        admin_attachment
        createdAt
        updatedAt
    }
}
`;

export const REPLY_SUPPORT_TICKET = gql`
mutation ReplySupportTicket($id: ID!, $admin_reply: String!, $admin_attachment: String) {
    replySupportTicket(id: $id, admin_reply: $admin_reply, admin_attachment: $admin_attachment) {
        id
        status
        admin_reply
        admin_attachment
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
        ticket_type_id {
            id
            label_ar
            label_en
            requires_fee
        }
        status
        admin_reply
        attachment
        admin_attachment
        payment_status
        has_fees
        fee_amount
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
        ticket_type_id {
            id
            label_ar
            label_en
            requires_fee
        }
        status
        admin_reply
        attachment
        admin_attachment
        payment_status
        has_fees
        fee_amount
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
        installment_id {
            id
            amount
            status
            is_paid
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
export const SET_SUMMER_COURSE_FEES = gql`
mutation SetSummerCourseFees($ticket_id: ID!, $student_id: ID!, $academy_term_id: ID, $amount: Float!) {
    setSummerCourseFees(ticket_id: $ticket_id, student_id: $student_id, academy_term_id: $academy_term_id, amount: $amount) {
        id
        serial
        status
        has_fees
        fee_amount
        payment_status
        installment_id {
            id
            amount
            status
            is_paid
        }
    }
}
`;

export const GET_ALL_SUPPORT_TICKET_TYPES = gql`
query GetSupportTicketTypes {
    getSupportTicketTypes {
        id
        serial
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
            status
        }
        createdAt
        updatedAt
    }
}
`;

export const GET_SUPPORT_TICKET_TYPE_BY_ID = gql`
query GetSupportTicketTypeById($id: ID!) {
    getSupportTicketTypeById(id: $id) {
        id
        serial
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
        }
        createdAt
        updatedAt
    }
}
`;

export const CREATE_SUPPORT_TICKET_TYPE = gql`
mutation CreateSupportTicketType($input: CreateSupportTicketTypeInput!) {
    createSupportTicketType(input: $input) {
        id
        serial
        label_ar
        label_en
        requires_fee
        fees {
            id
            serial
            title_ar
            title_en
        }
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_SUPPORT_TICKET_TYPE = gql`
mutation UpdateSupportTicketType($id: ID!, $input: UpdateSupportTicketTypeInput!) {
    updateSupportTicketType(id: $id, input: $input) {
        id
        serial
        label_ar
        label_en
        requires_fee
        fees {
            id
            serial
            title_ar
            title_en
        }
        createdAt
        updatedAt
    }
}
`;

export const DELETE_SUPPORT_TICKET_TYPE = gql`
mutation DeleteSupportTicketType($id: ID!) {
    deleteSupportTicketType(id: $id)
}
`;

