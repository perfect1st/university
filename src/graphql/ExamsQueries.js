import { gql } from "@apollo/client";

export const GET_FILTERED_EXAMS=gql`
query FilteredPagedExams(
    $limit: Int
    $page: Int
    $search: String
    $exam_type: String
    $materials: [ID]
    ) 
    {
    filteredPagedExams(search: $search, exam_type: $exam_type, page: $page, limit: $limit, materials: $materials) {
        total
        exams {
            id
            serial
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
          
        }
    }
}
`;

export const ADD_NEW_EXAM=gql`
mutation CreateExam($input: CreateExamInput!) {
    createExam(input: $input) {
        id
        serial
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

export const UPDATE_EXAM_BY_ID=gql`
mutation UpdateExam($id:ID!,$input: UpdateExamInput!) {
    updateExam(id: $id, input: $input) {
        id
        serial
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