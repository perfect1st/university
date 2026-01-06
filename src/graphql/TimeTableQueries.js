import { gql } from "@apollo/client";

export const GET_FILTERED_MAIN_TABLES=gql`
query GetMainTimeTablesFiltered(
    $limit: Int!
    $page: Int!
    $search: String
    $status: Boolean
    $faculty_id: ID
    $faculty_department_id: ID
    $academy_term_id: ID
    ) {
    getMainTimeTablesFiltered(
        search: $search
        status: $status
        faculty_id: $faculty_id
        faculty_department_id: $faculty_department_id
        academy_term_id: $academy_term_id
        page: $page
        limit: $limit
    ) {
        total
        mainTimeTables {
            id
            number
            title_ar
            title_en
            study_year
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
            academy_term_id {
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
            created_by {
                id
                username
                fullname
                email
                mobile
                role
                status
                profile_image
                qid_number
                is_inside_yemen
                createdAt
                updatedAt
            }
        }
    }
}
`;

export const CREATE_TIME_TABLE=gql`
mutation CreateMainTimeTable($input:MainTimeTableInput!) {
    createMainTimeTable(input: $input) {
        id
        number
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
        faculty_department_id {
            id
            title_ar
            title_en
            status
            createdAt
            updatedAt
        }
        academy_term_id {
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
}
`;

export const UPDATE_MAIN_TIME_TABLE_BY_ID=gql`
mutation UpdateMainTimeTable($id:ID!,$input:MainTimeTableInput!) {
    updateMainTimeTable(id: $id, input: $input) {
        id
        number
        title_ar
        title_en
        study_year
        status
        createdAt
        updatedAt
    }
}
`;