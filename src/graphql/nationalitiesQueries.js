import { gql } from "@apollo/client";

export const GET_ALL_NATIONALITIES=gql`
    query Nationalities {
    nationalities {
        id
        name_ar
        name_en
        flag
        status
        createdAt
        updatedAt
    }
}
`;

export const GET_FILTERED_NATIONALITIES=gql`
query FilteredPagedNationalities(
    $limit: Int!
    $page: Int!
    $status: Boolean
    $search: String
    ) {
    filteredPagedNationalities(search: $search, page: $page, limit: $limit, status: $status) {
        total
        nationalities {
            id
            name_ar
            name_en
            flag
            status
            createdAt
            updatedAt
        }
    }
}
`;

export const CREATE_NEW_NATIONALITY=gql`
mutation CreateNationality($input:CreateNationalityInput!) {
    createNationality(input: $input) {
        id
        name_ar
        name_en
        flag
        status
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_NATIONALITY_BY_ID=gql`
mutation UpdateNationality($id:ID!,$input:UpdateNationalityInput!) {
    updateNationality(id: $id, input: $input) {
        id
        name_ar
        name_en
        flag
        status
        createdAt
        updatedAt
    }
}
`;