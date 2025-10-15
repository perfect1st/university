import { gql } from "@apollo/client";

export const GetWebsiteDepartments = gql`
  query GetWebsiteDepartments {
    websiteDepartments {
      id
      title_ar
      title_en
      desc_ar
      desc_en
      image
      status
      createdAt
      updatedAt
    }
  }
`;

export const getDepartmentByFatherId = gql`
  query getDepartmentByFatherId($father_id: ID!) {
    getDepartmentsByFather(father_id: $father_id) {
      id
      title_ar
      title_en
      desc_ar
      desc_en
      image
      status
      createdAt
      updatedAt
    }
  }
`;
