import { gql } from "@apollo/client";

export const  CREATE_LECTURE_SESSION=gql`
mutation CreateLectureSession($input:CreateLectureSessionInput!) {
    createLectureSession(input: $input) {
        id
        notes
        session_task
        attachments
        status
        createdAt
        updatedAt
        lecture_url
        lecture_videos
        lecture_date
        study_year
    }
}
`;

export const GET_LECTURE_SESSION_BY_ID=gql`
query GetLectureSessionById($id: ID!) {
    getLectureSessionById(id: $id) {
        id
        study_year
        lecture_date
        lecture_videos
        lecture_url
        notes
        session_task
        attachments
        status
        createdAt
        updatedAt
        timetable_id {
            id
            day
            start_time
            end_time
            section
            status
            createdAt
            updatedAt
        }
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

export const UPDATE_LECTURE_SESSION_BY_ID=gql`
mutation UpdateLectureSession($id:ID!,$input:UpdateLectureSessionInput!) {
    updateLectureSession(id: $id, input: $input) {
        id
        study_year
        lecture_date
        lecture_videos
        lecture_url
        notes
        session_task
        attachments
        status
        createdAt
        updatedAt
    }
}
`;

export const CANCEL_LECTURE_SESSION=gql`
mutation CreateCanceledLectureSession($timetable_id:ID!) {
    createCanceledLectureSession(timetable_id: $timetable_id) {
        id
        study_year
        lecture_date
        lecture_videos
        lecture_url
        notes
        session_task
        attachments
        status
        createdAt
        updatedAt
    }
}
`;

// lectures sessions for doctor
export const GET_LECTURE_SESSIONS_FOR_DOCTOR=gql`
query LectureSessionsByDoctor(
    $material_id: ID
    $lecture_date: String
    $page: Int
    $limit: Int
    $search: String
    ) {
    lectureSessionsByDoctor(
        material_id: $material_id
        lecture_date: $lecture_date
        page: $page
        limit: $limit
        search: $search
    ) {
        total
        lectureSessions {
            id
            study_year
            lecture_date
            lecture_videos
            lecture_url
            notes
            session_task
            attachments
            status
            createdAt
            updatedAt
            timetable_id {
                id
                day
                start_time
                end_time
                section
                status
                createdAt
                updatedAt
            }
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
}
`;

export const GET_LECTURE_SESSIONS_FOR_STUDENT=gql`
query LectureSessionsByStudent(
    $academy_term_id: ID!
    $study_year: String!
    $material_id: ID
    $lecture_date: String
    $search: String
    $page: Int
    $limit: Int
    ) {
    lectureSessionsByStudent(
        academy_term_id: $academy_term_id
        study_year: $study_year
        material_id: $material_id
        lecture_date: $lecture_date
        search: $search
        page: $page
        limit: $limit
    ) {
        total
        lectureSessions {
            id
            study_year
            lecture_date
            lecture_videos
            lecture_url
            notes
            session_task
            attachments
            status
            createdAt
            updatedAt
            timetable_id {
                id
                day
                start_time
                end_time
                section
                status
                createdAt
                updatedAt
            }
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
}
`;