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
      user_id
      status
    }
    registration_Fees_Value
    registration_Fees_Id
  }
}
`;

// {
//     success
//     message
//     user {
//       id
//       fullname
//     }
//     form {
//       user_id
//       status
//     }
//     registration_Fees_Value
//   }