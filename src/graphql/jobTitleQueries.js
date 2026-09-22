import { gql } from "@apollo/client";

export const GET_ACTIVE_JOB_TITLES = gql`
  query GetActiveJobTitles {
    getActiveJobTitles {
      id
      serial
      name_ar
      name_en
      status
    }
  }
`;

export const GET_FILTERED_JOB_TITLES = gql`
  query GetFilteredJobTitles(
    $search: String
    $status: Boolean
    $page: Int
    $limit: Int
  ) {
    filteredPagedJobTitles(
      search: $search
      status: $status
      page: $page
      limit: $limit
    ) {
      total
      jobTitles {
        id
        serial
        name_ar
        name_en
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_JOB_TITLE = gql`
  mutation CreateJobTitle($input: CreateJobTitleInput!) {
    createJobTitle(input: $input) {
      id
      serial
      name_ar
      name_en
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_JOB_TITLE = gql`
  mutation UpdateJobTitle($id: ID!, $input: UpdateJobTitleInput!) {
    updateJobTitle(id: $id, input: $input) {
      id
      serial
      name_ar
      name_en
      status
      createdAt
      updatedAt
    }
  }
`;

export const TOGGLE_JOB_TITLE = gql`
  mutation ToggleJobTitle($id: ID!, $status: Boolean!) {
    toggleJobTitle(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DELETE_JOB_TITLE = gql`
  mutation DeleteJobTitle($id: ID!) {
    deleteJobTitle(id: $id)
  }
`;
