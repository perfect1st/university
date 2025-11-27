import { gql } from "@apollo/client";

export const CREATE_NEW_FACULTY_PRICE=gql`
mutation CreateFacultyPrice($input:FacultyPriceInput!) {
    createFacultyPrice(input: $input) {
        id
        level_year
        price_inside_yemen
        price_outside_yemen
        faculty_id
        faculty_department_id
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
        faculty_id
        faculty_department_id
        createdAt
        updatedAt
    }
}
`;