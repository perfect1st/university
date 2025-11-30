import { gql } from "@apollo/client";

export const GET_ALL_FACULITY_PRICES=gql`
query FacultyPrices {
    facultyPrices {
        id
        level_year
        price_inside_yemen
        price_outside_yemen
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

export const UPDATE_FACULITY_PRICE_BY_ID=gql`
mutation UpdateFacultyPrice($id:ID!,$input:FacultyPriceInput!) {
    updateFacultyPrice(id: $id, input: $input) {
        id
        level_year
        price_inside_yemen
        price_outside_yemen
        createdAt
        updatedAt
    }
}
`;