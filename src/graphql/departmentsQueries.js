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
// تجيب الترمات بتاعة القسم
export const GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID= gql`
query GetAcademyTermsByFacultyDepartment($faculty_department_id:ID!) {
    getAcademyTermsByFacultyDepartment(faculty_department_id: $faculty_department_id) {
        id
        title_ar
        title_en
        status
        study_year
        current_year
        term_number
        min_study_hours
        max_study_hours
        faculty_department_id
        materials_array
    }
}

`;