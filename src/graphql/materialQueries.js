import { gql } from "@apollo/client";

export const GET_ALL_MATERIALS=gql`
query Materials {
    materials {
        id
        title_ar
        title_en
        status
        fullmark_degree
        success_degree
        material_hours
        createdAt
        updatedAt
        faculty_department_id {
            id
            title_ar
            title_en
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
        }
    }
}
`;

export const CREATE_NEW_MATERIAL=gql`
mutation CreateMaterial($input:MaterialInput!) {
    createMaterial(input: $input) {
        id
        title_ar
        title_en
        status
        fullmark_degree
        success_degree
        material_hours
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_MATERIAL_BY_ID=gql`
mutation UpdateMaterial($id:ID!,$input:MaterialInput!) {
    updateMaterial(id: $id, input: $input) {
        id
        title_ar
        title_en
        status
        fullmark_degree
        success_degree
        material_hours
        createdAt
        updatedAt
    }
}
`;


export const GET_MATERIALS_BY_DEPARTMENT_ID=gql`
query MaterialsByDepartment($faculty_department_id:ID!) {
    materialsByDepartment(faculty_department_id: $faculty_department_id) {
        id
        title_ar
        title_en
        status
        fullmark_degree
        success_degree
        material_hours
        createdAt
        updatedAt
    }
}
`;