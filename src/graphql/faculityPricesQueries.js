import { gql } from "@apollo/client";

export const GET_ALL_FACULITY_PRICES=gql`
query FacultyPrices {
    facultyPrices {
        id
        level_year
        price_inside_yemen
        price_outside_yemen
        status
        createdAt
        updatedAt
        faculty_id {
            id
            title_ar
            title_en
            status
            required_dep
            study_years_count
            createdAt
            updatedAt
        }
        faculty_department_id {
            id
            title_ar
            title_en
            status
            createdAt
            updatedAt
        }
    }
}
`;
export const CREATE_NEW_FACULTY_PRICE=gql`
mutation CreateFacultyPrice($input:FacultyPriceInput!) {
    createFacultyPrice(input: $input) {
        id
        level_year
        price_inside_yemen
        price_outside_yemen
        createdAt
        updatedAt
    }
}
`;

export const GET_ALL_FACULITY_PRICES_FILTERED=gql`
query FilteredPagedFacultyPrices(
    $search: String
    $faculty_id:ID
    $faculty_department_id:ID
    $level_year: Int
    $status: Boolean
    $limit: Int
    $page: Int
    ) {
    filteredPagedFacultyPrices(
        search: $search
        faculty_id: $faculty_id
        faculty_department_id: $faculty_department_id
        level_year: $level_year
        status: $status
        page: $page
        limit: $limit
    ) {
        total
        facultyPrices {
            id
            level_year
            price_inside_yemen
            price_outside_yemen
            status
            createdAt
            updatedAt
            faculty_id {
                id
                title_ar
                title_en
                status
                required_dep
                study_years_count
                createdAt
                updatedAt
            }
            faculty_department_id {
                id
                title_ar
                title_en
                status
                createdAt
                updatedAt
            }
        }
    }
}
`;

export const UPDATE_FACULITY_PRICE_BY_ID=gql`
mutation UpdateFacultyPrice($id:ID!,$input:FacultyPriceInput!) {
    updateFacultyPrice(id: $id, input: $input) {
        id
        level_year
        price_inside_yemen
        price_outside_yemen
        status
        createdAt
        updatedAt
    }
}
`;