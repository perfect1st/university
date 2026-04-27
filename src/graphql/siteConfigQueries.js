import { gql } from "@apollo/client";

export const GET_SITE_CONFIG = gql`
    query GetSiteConfig {
        getSiteConfig {
            id
            privacy_policy_ar
            privacy_policy_en
            terms_of_service_ar
            terms_of_service_en
            accessibility_ar
            accessibility_en
            createdAt
            updatedAt
            social_media {
                facebook
                tiktok
                twitter
            }
            contact_info {
                email
                whatsapp_saudi
                whatsapp_yemeni
                phone_yemeni_1
                phone_yemeni_2
            }
        }
    }
`;

export const UPDATE_SITE_CONFIG = gql`
    mutation UpdateSiteConfig($input: SiteConfigInput!) {
        updateSiteConfig(input: $input) {
            id
            privacy_policy_ar
            privacy_policy_en
            terms_of_service_ar
            terms_of_service_en
            accessibility_ar
            accessibility_en
            createdAt
            updatedAt
            social_media {
                facebook
                tiktok
                twitter
            }
            contact_info {
                email
                whatsapp_saudi
                whatsapp_yemeni
                phone_yemeni_1
                phone_yemeni_2
            }
        }
    }
`;

export const GET_SETTINGS = gql`
query GetSettings {
    getSettings {
        id
        serial
        register_conditions_file_inside_yemen
        register_conditions_file_outside_yemen
        bank_account_inside_yemen
        bank_account_outside_yemen
        registration_Fees
        support_ticket_fees {
            type
            fees
        }
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_SETTING = gql`
mutation UpdateSetting($id: ID!, $input: SettingInput!) {
    updateSetting(id: $id, input: $input) {
        id
        serial
        register_conditions_file_inside_yemen
        register_conditions_file_outside_yemen
        bank_account_inside_yemen
        bank_account_outside_yemen
        registration_Fees
        university_card_fee
        university_certificate_fee
        graduation_certificate_fee
        success_statement_fee
        registration_suspension_fee
        support_ticket_fees {
            type
            fees
        }
        createdAt
        updatedAt
    }
}
`;

export const GET_FEES_TYPES = gql`
query GetFeesTypes {
    getFeesTypes {
        id
        serial
        title_ar
        title_en
        inside_yemen_value
        outside_yemen_value
        createdAt
        updatedAt
        status
    }
}
`;
