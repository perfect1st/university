import { gql } from "@apollo/client";

export const GET_ALL_STUDENT_DEGREES=gql`
query StudentDegreesAll($doctor_id: ID)
   {
    studentDegreesAll(doctor_id: $doctor_id) {
        student {
            serial
            fullname
            email
        }
        subjects {
            material_id {
                title_en
                title_ar
            }
            exams {
                exam_id {
                    serial
                    exam_type
                    exam_name
                }
                student_degree
                lecture_attendance
                total_exam_degree
                exam_attendance
                full_mark
            }
            totals {
                total_full_mark
                total_student_degree
                total_lecture_attendance
                total_exam_degree
            }
        }
    }
}
`;

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
            serial
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
        serial
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
        serial
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
        material_id {
            id
            serial
            title_ar
            title_en
            status
            fullmark_degree
            success_degree
            material_hours
            file
            createdAt
            updatedAt
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

export const GET_ACADEMIC_TRANSCRIPT = gql`
query GetAcademicTranscript($student_id: ID!) {
    getAcademicTranscript(student_id: $student_id) {
        overall_total_subjects
        overall_total_hours
        overall_total_degrees
        overall_max_degrees
        overall_average
        overall_grade
        generated_at
        student {
            id
            serial
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
        faculty {
            id
            serial
            title_ar
            title_en
            status
            required_dep
            study_years_count
            createdAt
            updatedAt
        }
        faculty_department {
            id
            serial
            title_ar
            title_en
            status
            createdAt
            updatedAt
        }
        levels {
            study_year
            total_subjects
            total_hours
            total_degrees
            average
            grade
            terms {
                term_number
                total_hours
                total_degrees
                average
                grade
                term {
                    id
                    serial
                    title_ar
                    title_en
                    status
                    study_year
                    current_year
                    term_number
                    min_study_hours
                    max_study_hours
                }
                subjects {
                    material {
                        id
                        serial
                        title_ar
                        title_en
                        fullmark_degree
                        success_degree
                    }
                    hours
                    degree
                    grade
                }
            }
        }
        summary {
            study_year
            total_subjects
            total_hours
            total_degrees
            average
            grade
        }
    }
}
`;