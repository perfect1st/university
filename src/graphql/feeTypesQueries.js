import { gql } from "@apollo/client";

export const GET_ALL_FEES_TYPES=gql`
query GetFeesTypes {
    getFeesTypes {
        id
        title_ar
        title_en
        inside_yemen_value
        outside_yemen_value
        status
        createdAt
        updatedAt
    }
}
`;

export const CREATE_NEW_FEES_TYPE=gql`
mutation CreateFeesType($input:FeesTypeInput!) {
    createFeesType(input: $input) {
        id
        title_ar
        title_en
        inside_yemen_value
        outside_yemen_value
        status
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_ONE_FEE_BY_ID=gql`
mutation UpdateFeesType($id:ID!,$input:FeesTypeInput!) {
    updateFeesType(id: $id, input: $input) {
        id
        title_ar
        title_en
        inside_yemen_value
        outside_yemen_value
        status
        createdAt
        updatedAt
    }
}
`;