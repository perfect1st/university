import { gql } from "@apollo/client";

export const GET_ALL_NATIONALITIES=gql`
    query Nationalities {
    nationalities {
        id
        name_ar
        name_en
        flag
        createdAt
        updatedAt
    }
}
`;