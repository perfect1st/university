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



export const CREATE_NEW_COUNTRY=gql`
mutation CreateCountry($input:CreateCountryInput!) {
    createCountry(input: $input) {
        id
        name_ar
        name_en
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_COUNTRY_BY_ID=gql`
mutation UpdateCountry($id:ID!, $input:UpdateCountryInput!) {
    updateCountry(id: $id, input: $input) {
        id
        name_ar
        name_en
        createdAt
        updatedAt
    }
}

`;


//////////////  cities //////////////////////////
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

export const CREATE_NEW_CITY=gql`
mutation CreateCity($input:CreateCityInput!) {
    createCity(input: $input) {
        id
        name_ar
        name_en
        country_id
        createdAt
        updatedAt
    }
}

`;

export const UPDATE_CITY_BY_ID=gql`
mutation UpdateCity($id:ID!,$input:UpdateCityInput!) {
    updateCity(id: $id , input: $input) {
        id
        name_ar
        name_en
        country_id
        createdAt
        updatedAt
    }
}

`;