import { gql } from "@apollo/client";

export const GET_ALL_COUNTRIES=gql`
query Countries {
    countries {
        id
        name_ar
        name_en
        createdAt
        updatedAt
    }
}
`;

export const GET_CITIES_BY_COUNTRY_ID=gql`
query GetCitiesByCountry($country_id:ID!) {
    getCitiesByCountry(country_id: $country_id) {
        id
        name_ar
        name_en
        country_id
        createdAt
        updatedAt
    }
}
`;

