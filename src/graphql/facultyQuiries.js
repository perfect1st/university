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