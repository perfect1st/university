import { gql } from "@apollo/client";


// ///////////////////////////////////تجيب الترمات بتاعة القسم
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
    }
}

`;