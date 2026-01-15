import { gql } from "@apollo/client";

export const GET_EXAM_DEGREES=gql`
query StudentDegrees(
$material_id: ID
$exam_id: ID
$page: Int
$limit: Int
$search: String
) {
    studentDegrees(material_id: $material_id, exam_id: $exam_id, page: $page, limit: $limit,search:$search) {
        total
        studentDegrees {
            id
            lecture_attendance
            exam_attendance
            student_degree
            createdAt
            updatedAt
            student_id {
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
            exam_id {
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
    }
}
`;

export const CREATE_STUDENT_DEGREE=gql`
mutation CreateStudentDegree($input: CreateStudentDegreeInput!) {
    createStudentDegree(input: $input) {
        id
        lecture_attendance
        exam_attendance
        student_degree
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_STUDENT_DEGREE=gql`
mutation UpdateStudentDegree($id:ID!,$input: UpdateStudentDegreeInput!) {
    updateStudentDegree(id: $id, input: $input) {
        id
        lecture_attendance
        exam_attendance
        student_degree
        createdAt
        updatedAt
    }
}

`;


export const GET_STUDENT_DEGRESS_BY_STUDENT_ID=gql`
query StudentDegreeByStudent($student_id: ID!) {
    studentDegreeByStudent(student_id: $student_id) {
        exams {
            exam_attendance
            full_mark
            student_degree
            lecture_attendance
            total_exam_degree
             exam_id {
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
        totals {
            total_full_mark
            total_student_degree
            total_lecture_attendance
            total_exam_degree
        }
    }
}
`;