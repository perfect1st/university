import { gql } from "@apollo/client";

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