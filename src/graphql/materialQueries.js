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
        faculty_department_id
        material_hours
        createdAt
        updatedAt
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
        faculty_department_id
        material_hours
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_MATERIAL=gql`
mutation UpdateMaterial($id:ID!,$input:MaterialInput!) {
    updateMaterial(id: $id, input: $input) {
        id
        title_ar
        title_en
        status
        fullmark_degree
        success_degree
        faculty_department_id
        material_hours
        createdAt
        updatedAt
    }
}

`;