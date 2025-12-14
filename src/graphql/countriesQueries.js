import { gql } from "@apollo/client";

export const GET_ALL_COUNTRIES=gql`
query Countries {
    countries {
        id
        name_ar
        name_en
        status
        createdAt
        updatedAt
    }
}
`;

export const GET_FILTERED_COUNTRIES=gql`
query FilteredPagedCountries(
    $limit: Int!
    $page: Int!
    $search: String
    $status: Boolean
    ) {
    filteredPagedCountries(search: $search, page: $page, limit: $limit, status: $status) {
        total
        countries {
            id
            name_ar
            name_en
            status
            createdAt
            updatedAt
        }
    }
}
`;

export const GET_COUNTRY_BY_ID=gql`
query Country($id:ID!) {
    country(id: $id) {
        id
        name_ar
        name_en
        status
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
        status
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
        status
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
        status
        createdAt
        updatedAt
    }
}
`;

export const GET_FILTERED_CITIES=gql`
query FilteredPagedCities(
    $limit: Int!
    $page: Int!
    $search: String
    $country_id:ID
    $status: Boolean
    ) {
    filteredPagedCities(search: $search, country_id: $country_id, page: $page, limit: $limit, status: $status) {
        total
        cities {
            id
            name_ar
            name_en
            status
            createdAt
            updatedAt
        }
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
        status
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
        status
        createdAt
        updatedAt
    }
}

`;