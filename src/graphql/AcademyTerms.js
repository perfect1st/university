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

export const GET_ACADEMY_TERMS_WITH_FILTER=gql`
query FilteredPagedAcademyTerms(
    $limit: Int!
    $page: Int!
    $search: String
    $faculty_department_id: ID
    $status: Boolean
    ) {
    filteredPagedAcademyTerms(
        search: $search
        faculty_department_id: $faculty_department_id
        status: $status
        page: $page
        limit: $limit
    ) {
        total
        academyTerms {
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
}
`;

export const GET_ONE_ACADEMY_TERM_BY_ID=gql`
query GetAcademyTermById($id:ID!) {
    getAcademyTermById(id: $id) {
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
        materials_array {
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