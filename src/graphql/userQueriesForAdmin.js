import { gql } from "@apollo/client";

export const GET_ALL_USERES_FOR_ADMIN=gql`
query Users {
    users {
        id
        username
        fullname
        email
        mobile
        role
        status
        profile_image
        qid_number
        createdAt
        updatedAt
    }
}
`;