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


//    student_id: "6919cc6cb19a6335c3805d7d"
//             material_id: "690b32d1ae33204319ed82ad"
//             lecture_attendance: 20
//             exam_id: "69676625af554e260cad3b82"
//             exam_attendance:true