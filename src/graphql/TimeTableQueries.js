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
            serial
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

export const CREATE_MAIN_TIME_TABLE=gql`
mutation CreateMainTimeTable($input:MainTimeTableInput!) {
    createMainTimeTable(input: $input) {
        id
        serial
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
        serial
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

export const CREATE_TIME_TABLE=gql`
mutation CreateTimeTable($input:CreateTimeTableInput!) {
    createTimeTable(input: $input) {
        id
        serial
        day
        start_time
        end_time
        section
        status
         main_time_table_id {
            id
            number
            title_ar
            title_en
            study_year
            status
            createdAt
            updatedAt
        }
        doctor_id {
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
        material_id {
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
        createdAt
        updatedAt
    }
}
`;

export const GET_TIME_TABLES_BY_MAIN_TABLE_ID=gql`
query TimeTablesByMainTimeTable($main_time_table_id:ID!) {
    timeTablesByMainTimeTable(main_time_table_id: $main_time_table_id) {
        id
        serial
        day
        start_time
        end_time
        section
        status
        createdAt
        updatedAt
        main_time_table_id {
            id
            number
            title_ar
            title_en
            study_year
            status
            createdAt
            updatedAt
        }
        material_id {
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
        doctor_id {
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
`;

export const DELETE_TIME_TABLE_BY_ID=gql`
mutation DeleteTimeTable($id:ID!) {
    deleteTimeTable(id: $id)
}
`;

export const GET_TIME_TABLE_BY_DOCTOR_ID=gql`
query TimeTablesByDoctor($doctor_id:ID!) {
    timeTablesByDoctor(doctor_id: $doctor_id) {
        id
        serial
        day
        start_time
        end_time
        section
        status
        createdAt
        updatedAt
        main_time_table_id {
            id
            number
            title_ar
            title_en
            study_year
            status
            createdAt
            updatedAt
        }
        material_id {
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
        doctor_id {
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
`;

export const GET_TIME_TABLE_BY_ACADEMY_TERM_ID=gql`
query TimeTablesByTerm($academy_term_id:ID!) {
    timeTablesByTerm(academy_term_id: $academy_term_id) {
        id
        serial
        day
        start_time
        end_time
        section
        status
        createdAt
        updatedAt
        main_time_table_id {
            id
            number
            title_ar
            title_en
            study_year
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
        material_id {
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
        doctor_id {
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
`;

export const TODAY_TIME_TABLE=gql`
query TodayTimeTable($doctor_id:ID,$academy_term_id:ID,$day:String!) {
    todayTimeTable(
    doctor_id: $doctor_id, 
    academy_term_id: $academy_term_id, 
    day: $day
    ) {
        id
        serial
        day
        start_time
        end_time
        section
        status
        lecture_status
        lecture_id
        lecture_url
        createdAt
        updatedAt
        main_time_table_id {
            id
            number
            title_ar
            title_en
            study_year
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
        material_id {
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
        doctor_id {
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
`;