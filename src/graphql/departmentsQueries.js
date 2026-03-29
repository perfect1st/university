import { gql } from "@apollo/client";

////////////////website departments////////////////////////////////////////

export const GetWebsiteDepartments = gql`
  query GetWebsiteDepartments {
    websiteDepartments {
      id
      serial
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
      serial
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

export const GET_WEBSITE_DEPARTMENTS_BY_ADMIN=gql`
query WebsiteDepartments {
    websiteDepartments {
        id
        serial
        title_ar
        title_en
        desc_ar
        desc_en
        image
        status
        createdAt
        updatedAt
        father_id {
            id
            title_ar
            title_en
            desc_ar
            desc_en
            image
            status
            createdAt
            updatedAt
            father_id {
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
    }
}
`;

export const CREATE_WEBSITE_DEPARTMENT_BY_ADMIN=gql`
mutation CreateWebsiteDepartment($input:CreateWebsiteDepartmentInput!) {
    createWebsiteDepartment(input: $input) {
        id
        serial
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

export const UPDATE_WEBSITE_DEPARTMENT_BY_ID=gql`
mutation UpdateWebsiteDepartment($id:ID!,$input:UpdateWebsiteDepartmentInput!) {
    updateWebsiteDepartment(id: $id, input: $input) {
        id
        serial
        title_ar
        title_en
        desc_ar
        desc_en
        image
        status
        createdAt
        updatedAt
          father_id {
            id
            title_ar
            title_en
            desc_ar
            desc_en
            image
            status
            createdAt
            updatedAt
            father_id {
                id
                title_ar
                title_en
                desc_ar
                desc_en
                image
                status
                createdAt
                updatedAt
                father_id {
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
        }
    }
}
`;

export const GET_DEPARTMENTS_BY_FATHER_ID_FOR_ADMIN=gql`
query GetDepartmentsByFather($father_id: ID!) {
    getDepartmentsByFather(father_id: $father_id) {
        id
        serial
        title_ar
        title_en
        desc_ar
        desc_en
        image
        status
        createdAt
        updatedAt
        father_id {
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
}
`;