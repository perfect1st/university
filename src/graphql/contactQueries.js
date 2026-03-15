import { gql } from "@apollo/client";

export const CREATE_CONTACT_US = gql`
mutation CreateContactUs($input: CreateContactUsInput!) {
    createContactUs(input: $input) {
        id
        name
        email
        phone
    }
}
`;

export const GET_CONTACT_US_MESSAGES = gql`
query GetContactUsMessages {
    getContactUsMessages {
        id
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

export const MARK_CONTACT_US_AS_READ = gql`
mutation MarkContactUsAsRead($id: ID!) {
    markContactUsAsRead(id: $id) {
        id
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
