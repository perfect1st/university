import { gql } from "@apollo/client";

export const PREVIEW_PROMOTION = gql`
query PreviewPromotion($input: PreviewPromotionInput!) {
    previewPromotion(input: $input) {
        total_students
        will_promote_count
        will_fail_count
        students {
            status
            student_id {
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
            failed_materials {
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
        }
    }
}
`;

export const FILTERED_PAGED_PROMOTIONS = gql`
query FilteredPagedPromotions(
    $promotion_type: String
    $faculty_department_id: ID
    $promotion_status: String
    $page: Int
    $limit: Int
) {
    filteredPagedPromotions(
        promotion_type: $promotion_type
        faculty_department_id: $faculty_department_id
        promotion_status: $promotion_status
        page: $page
        limit: $limit
    ) {
        total
        promotions {
            id
            serial
            promotion_type
            promotion_date
            total_students
            promoted_count
            failed_count
            notes
            source_study_year
            promotion_status
            createdAt
            updatedAt
        }
    }
}
`;

export const PROMOTE_TERM_TO_TERM = gql`
mutation PromoteTermToTerm($input: TermToTermInput!) {
    promoteTermToTerm(input: $input) {
        id
        serial
        promotion_type
        promotion_date
        total_students
        promoted_count
        failed_count
        notes
        source_study_year
        promotion_status
        createdAt
        updatedAt
    }
}
`;

export const PROMOTE_YEAR_TO_YEAR = gql`
mutation PromoteYearToYear($input: YearToYearInput!) {
    promoteYearToYear(input: $input) {
        id
        serial
        promotion_type
        promotion_date
        total_students
        promoted_count
        failed_count
        notes
        source_study_year
        promotion_status
        createdAt
        updatedAt
    }
}
`;

export const ACTIVATE_PROMOTION = gql`
mutation ActivatePromotion($id: ID!) {
    activatePromotion(id: $id) {
        id
        serial
        promotion_type
        promotion_date
        total_students
        promoted_count
        failed_count
        notes
        source_study_year
        promotion_status
        createdAt
        updatedAt
    }
}
`;

export const DELETE_DRAFT_PROMOTION = gql`
mutation DeleteDraftPromotion($id: ID!) {
    deleteDraftPromotion(id: $id)
}
`;

export const GET_STUDY_YEARS_BY_DEPARTMENT = gql`
query GetStudyYearsByDepartment($faculty_department_id: ID!) {
    getStudyYearsByDepartment(faculty_department_id: $faculty_department_id) {
        study_year
    }
}
`;
