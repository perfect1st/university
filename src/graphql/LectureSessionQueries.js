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