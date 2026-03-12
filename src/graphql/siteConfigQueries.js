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
