import { gql } from "@apollo/client";

/* 🟩 1. Queries */
export const GET_USERS = gql`
  query Users {
  users {
          id
        serial
        username
        fullname
        email
        mobile
        role
        status
        profile_image
        qid_number
        is_inside_yemen
        createdAt
        updatedAt
  }
}
`;


export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
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
`;

// login 
export const LOGIN_USER = gql`
mutation Login($input: LoginInput!) {
    login(input: $input) {
        token
          user {
            id
            serial
            username
            fullname
            email
            mobile
            role
            status
            profile_image
            qid_number
            is_inside_yemen
            createdAt
            updatedAt
            groups {
                id
                serial
                name_ar
                name_en
                permissions
                createdAt
                updatedAt
            }
        }
    }
}
`;

export const GET_LOGGED_USER_BY_TOKEN = gql`
query Me {
    me {
        id
        serial
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
               groups {
            id
            name_ar
            name_en
            permissions
            createdAt
            updatedAt
        }
    }
}
`;


export const GET_USER_REQUIRED_FEES_BY_STUDENT_ID = gql`
query GetUsersRequiredFeesByStudent($student_id: ID!) {
    getUsersRequiredFeesByStudent(student_id: $student_id) {
        is_inside_yemen
        required_fees {
            id
            is_paid
            createdAt
            updatedAt
            student_id {
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
            website_user_id {
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
            fees_types_ids {
                id
                title_ar
                title_en
                inside_yemen_value
                outside_yemen_value
                createdAt
                updatedAt
            }
              transactions_id {
                id
                payment_method_type
                amount
                payment_document_file
                transaction_date
                transaction_serial
            }
            academy_term_id {
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
    }
}

`;

export const PAY_USER_REQUIRED_FEES = gql`
mutation PayUserRequiredFees(
$input: PayUserRequiredFeesInput!
) {
    payUserRequiredFees(input: $input) {
        id
        payment_method_type
        amount
        payment_document_file
        transaction_date
        transaction_serial
        transaction_type_snapshot {
            id
            title_ar
            title_en
            operation_type
            notes
            status
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
        fees_type_snapshot {
            id
            title_ar
            title_en
            inside_yemen_value
            outside_yemen_value
            status
        }
    }
}

`;

// الطالب بيخنار المواد الل عاوز ياخدها ف الترم 
export const CREATE_USER_STUDY_MATERIAL = gql`
mutation CreateUserStudyMaterial($input:UserStudyMaterialInput!) {
    createUserStudyMaterial(input: $input) {
        id
        serial
        status
        createdAt
        updatedAt
    }
}
`;

export const UPDATE_USER_STUDY_MATERIAL = gql`
mutation UpdateUserStudyMaterial($id: ID!, $input: UserStudyMaterialInput!, $serial: Int) {
    updateUserStudyMaterial(id: $id, input: $input, serial: $serial) {
        id
        serial
        status
        createdAt
        updatedAt
    }
}
`;

export const GET_USER_STUDY_MATERIALS_BY_USER_ID = gql`
query GetUserStudyMaterialsByUser($user_id:ID!, $academyTerm_id:ID!) {
    getUserStudyMaterialsByUser(user_id: $user_id, academyTerm_id: $academyTerm_id) {
        id
        serial
        status
        createdAt
        updatedAt
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
        }
        material_id {
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
    }
}
`;


