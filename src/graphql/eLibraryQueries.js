import { gql } from "@apollo/client";

export const GET_ALL_LIBRARIES = gql`
query Libraries {
    libraries {
     id
     serial
        title_ar
        title_en
        status
        author_name
        file
        createdAt
        updatedAt
    }
}
`;

export const CREATE_NEW_BOOK = gql`
mutation CreateLibrary($input:LibraryInput!) {
    createLibrary(input: $input) {
     id
     serial
        title_ar
        title_en
        status
        author_name
        file
        createdAt
        updatedAt 
        
    }
}
`;

export const UPDATE_Library_BY_ID = gql`
mutation UpdateLibrary($id:ID!,$input:LibraryInput!) {
    updateLibrary(id: $id, input: $input) {
            id
            serial
        title_ar
        title_en
        status
        author_name
        file
        createdAt
        updatedAt
    }
}
`;

export const Delete_Library_BY_ID = gql`
mutation DeleteLibrary($id:ID!) {
    deleteLibrary(id: $id) {
            id
        title_ar
        title_en
        status
        author_name
        file
        createdAt
        updatedAt
    }
}
`;



export const GET_ALL_FILTERED_LIBRARIES = gql`
query FilteredPagedLibraries(
    $limit: Int!
    $page: Int!
    $status: Boolean
    $search: String
    $faculty_department_id: ID
    $faculty_id: ID
    ) {
    filteredPagedLibraries(
        search: $search
        faculty_department_id: $faculty_department_id
        faculty_id: $faculty_id
        status: $status
        page: $page
        limit: $limit
    ) {
        total
        libraries {
            id
            serial
            title_ar
            title_en
            status
            author_name
            file
            createdAt
            updatedAt
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
        }
      
    }
}
`;

