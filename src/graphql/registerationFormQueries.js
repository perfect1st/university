import { gql } from "@apollo/client";

// nationality_id-> الجنسية
//national_id -> رقم الهوية
// national_id_type->  بطاقة الهوية,جواز سفر,رقم الاقامة  
export const CREATE_REGISTERATION_FORM=gql`
mutation CreateRegisterForm($input: RegisterFormInput!) {
    createRegisterForm(input: $input) {
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
        user_id
        nationality_id
        faculty_id
        faculty_department_id
        country_id
        city_id
        transactions_id
        national_id_type
        national_id
        createdAt
        updatedAt
    }
}
`;