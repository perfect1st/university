import { gql } from "@apollo/client";

export const GET_ALL_FACULITIES=gql`
query Faculties {
    faculties {
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
`;

export const GET_FACULITY_BY_ID=gql`
query Faculty($id:ID!) {
    faculty(id: $id) {
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

`;

export const CREATE_NEW_FACULITY=gql`
mutation CreateFaculty($input:CreateFacultyInput!) {
    createFaculty(input: $input) {
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
`;

export const UPDATE_FACULITY_BY_ID=gql`
mutation UpdateFaculty($id:ID!,$input:UpdateFacultyInput!) {
    updateFaculty(id: $id, input: $input) {
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

`;



//////////////Departments///////////////
export const GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID=gql`
query GetFacultyDepartmentsByFaculty($faculty_id:ID!) {
    getFacultyDepartmentsByFaculty(faculty_id: $faculty_id) {
        id
        title_ar
        title_en
        status
        faculty_id
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_FACULITY_DEPARTMENT_BY_ID=gql`
mutation UpdateFacultyDepartment($id:ID!,$input:UpdateFacultyDepartmentInput!) {
    updateFacultyDepartment(id: $id, input: $input) {
        id
        title_ar
        title_en
        status
        faculty_id
        createdAt
        updatedAt
    }
}

`;