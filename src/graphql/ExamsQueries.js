import { gql } from "@apollo/client";

export const GET_FILTERED_EXAMS=gql`
query FilteredPagedExams(
    $limit: Int
    $page: Int
    $search: String
    $exam_type: String
    ) 
    {
    filteredPagedExams(search: $search, exam_type: $exam_type, page: $page, limit: $limit) {
        total
        exams {
            id
            exam_name
            exam_type
            full_mark_degree
            lecture_attendance_mark
            date_from
            date_to
            notes
            createdAt
            updatedAt
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
}
`;

export const ADD_NEW_EXAM=gql`
mutation CreateExam($input: CreateExamInput!) {
    createExam(input: $input) {
        id
        exam_name
        exam_type
        full_mark_degree
        lecture_attendance_mark
        date_from
        date_to
        notes
        createdAt
        updatedAt
    }
}
`;