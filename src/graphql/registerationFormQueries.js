import { gql } from "@apollo/client";

// nationality_id-> الجنسية
//national_id -> رقم الهوية
// national_id_type->  بطاقة الهوية,جواز سفر,رقم الاقامة  
export const CREATE_REGISTERATION_FORM=gql`
mutation CreateRegisterForm($input: RegisterFormInput!) {
    createRegisterForm(input: $input){
    success
    message
    user {
      id
      fullname
    }
    form {
      user_id{
        id
      }
      status
    }
    registration_Fees_Value
    registration_Fees_Id
  }
}
`;

export const GET_REGISTERATION_FORM_BY_USER_ID=gql`
query GetRegisterFormByUserId($user_id:ID!) {
    getRegisterFormByUserId(user_id: $user_id) {
        id
        first_name
        second_name
        third_name
        fourth_name
        birthdate
        gender
        is_paid
        paid_document_file
        high_school_certificate_file
        address
        status
        mobile
        home_tel
        email
        is_inside_yemen
        transactions_id
        national_id_type
        national_id
        education_year
        study_place
        high_school_student_number
        general_grade
        gpa
        createdAt
        updatedAt
        faculty_department_id {
            id
            title_ar
            title_en
            status
            createdAt
            updatedAt
        }
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
        country_id {
            id
            name_ar
            name_en
            createdAt
            updatedAt
        }
        city_id {
            id
            name_ar
            name_en
            country_id
            createdAt
            updatedAt
        }
        academyTerm_id {
            id
            title_ar
            title_en
            status
            study_year
            current_year
            term_number
            min_study_hours
            max_study_hours
            materials_array {
                id
                title_ar
                title_en
                status
                fullmark_degree
                success_degree
                material_hours
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
        nationality_id {
            id
            name_ar
            name_en
            flag
            createdAt
            updatedAt
        }
        user_id {
            id
            username
            fullname
            email
            mobile
            role
            status
            profile_image
            qid_number
            createdAt
            updatedAt
        }
    }
}
`;
