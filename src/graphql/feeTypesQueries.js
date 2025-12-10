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

export const GET_ALL_FEES_TYPES_FILTERED=gql`
query GetFeesTypesFiltered(
    $limit: Int!
    $page: Int!
    $search: String
    $status: Boolean
    ) {
    getFeesTypesFiltered(search: $search, status: $status, page: $page, limit: $limit) {
        total
        feesTypes {
            id
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