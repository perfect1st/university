import { gql } from "@apollo/client";

export const GET_ALL_ACADEMY_TERMS=gql`
query GetAcademyTerms {
    getAcademyTerms {
        id
        title_ar
        title_en
        status
        study_year
        current_year
        term_number
        min_study_hours
        max_study_hours
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

export const CREATE_ACADEMY_TERM=gql`
mutation CreateAcademyTerm($input:AcademyTermInput!) {
    createAcademyTerm(input: $input) {
        id
        title_ar
        title_en
        status
        study_year
        current_year
        term_number
        min_study_hours
        max_study_hours
    }
}

`;

export const UPDATE_ACADEMY_TERM_BY_ID=gql`
mutation UpdateAcademyTerm($id:ID!,$input:AcademyTermInput!) {
    updateAcademyTerm(id: $id, input: $input) {
        id
        title_ar
        title_en
        status
        study_year
        current_year
        term_number
        min_study_hours
        max_study_hours
    }
}

`;


// ///////////////////////////////////تجيب الترمات بتاعة القسم
export const GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID= gql`
query GetAcademyTermsByFacultyDepartment($faculty_department_id:ID!) {
    getAcademyTermsByFacultyDepartment(faculty_department_id: $faculty_department_id) {
        id
        title_ar
        title_en
        status
        study_year
        current_year
        term_number
        min_study_hours
        max_study_hours
    }
}

`;