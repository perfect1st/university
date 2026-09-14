import { gql } from "@apollo/client";

export const GET_PAGED_SIGNATURES = gql`
  query FilteredPagedSignatures(
    $search: String
    $role_title: String
    $faculty_id: ID
    $is_active: Boolean
    $page: Int
    $limit: Int
  ) {
    filteredPagedSignatures(
      search: $search
      role_title: $role_title
      faculty_id: $faculty_id
      is_active: $is_active
      page: $page
      limit: $limit
    ) {
      total
      signatures {
        id
        serial
        name
        signature_image
        role_title
        is_active
        createdAt
        faculty_id {
          id
          title_ar
          title_en
        }
        department_id {
          id
          title_ar
          title_en
        }
      }
    }
  }
`;

export const CREATE_SIGNATURE = gql`
  mutation CreateSignature($input: CreateSignatureInput!) {
    createSignature(input: $input) {
      id
      serial
      name
      signature_image
      role_title
      is_active
      faculty_id {
        id
        title_ar
      }
      department_id {
        id
        title_ar
      }
    }
  }
`;

export const UPDATE_SIGNATURE = gql`
  mutation UpdateSignature($id: ID!, $input: UpdateSignatureInput!) {
    updateSignature(id: $id, input: $input) {
      id
      name
      signature_image
      role_title
      is_active
      faculty_id {
        id
        title_ar
      }
      department_id {
        id
        title_ar
      }
    }
  }
`;

export const DELETE_SIGNATURE = gql`
  mutation DeleteSignature($id: ID!) {
    deleteSignature(id: $id)
  }
`;

export const TOGGLE_SIGNATURE = gql`
  mutation ToggleSignature($id: ID!, $is_active: Boolean!) {
    toggleSignature(id: $id, is_active: $is_active) {
      id
      name
      is_active
    }
  }
`;

export const GET_SIGNATURES_BY_FACULTY = gql`
  query GetSignaturesByFaculty($faculty_id: ID!) {
    getSignaturesByFaculty(faculty_id: $faculty_id) {
      id
      name
      signature_image
      role_title
      faculty_id {
        id
        title_ar
      }
    }
  }
`;

export const GET_UNIV_SIGNATURES = gql`
  query GetUniversityLevelSignatures {
    getUniversityLevelSignatures {
      id
      name
      signature_image
      role_title
    }
  }
`;
