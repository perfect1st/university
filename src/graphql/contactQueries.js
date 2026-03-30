import { gql } from "@apollo/client";

export const CREATE_CONTACT_US = gql`
mutation CreateContactUs($input: CreateContactUsInput!) {
    createContactUs(input: $input) {
        id
        serial
        name
        email
        phone
    }
}
`;

export const GET_CONTACT_US_MESSAGES = gql`
query GetContactUsMessages($search: String, $status: String, $page: Int, $limit: Int) {
    getContactUsMessages(search: $search, status: $status, page: $page, limit: $limit) {
        contactUsMessages {
            id
            serial
            name
            email
            phone
            subject
            message
            status
            admin_reply
            createdAt
            updatedAt
        }
        total
    }
}
`;

export const MARK_CONTACT_US_AS_READ = gql`
mutation MarkContactUsAsRead($id: ID!) {
    markContactUsAsRead(id: $id) {
        id
        serial
        name
        email
        phone
        subject
        message
        status
        admin_reply
        createdAt
        updatedAt
    }
}
`;

export const REPLY_CONTACT_US = gql`
mutation ReplyContactUs($id: ID!, $admin_reply: String!) {
    replyContactUs(id: $id, admin_reply: $admin_reply) {
        id
        serial
        name
        email
        phone
        subject
        message
        status
        admin_reply
        createdAt
        updatedAt
    }
}
`;
