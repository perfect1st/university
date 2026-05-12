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
