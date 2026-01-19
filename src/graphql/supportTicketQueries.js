import { gql } from "@apollo/client";

export const CREATE_SUPPORT_TICKET=gql`
mutation CreateSupportTicket($input:CreateSupportTicketInput!) {
    createSupportTicket(input: $input) {
        id
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

export const GET_SUPPORT_TICKETS_BY_USER_ID=gql`
query GetSupportTicketsByUser($userId: ID!) {
    getSupportTicketsByUser(userId: $userId) {
        id
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