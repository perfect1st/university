import { gql } from "@apollo/client";

export const GET_STUDENT_INSTALLMENTS = gql`
  query GetStudentInstallments($student_id: ID!) {
    getStudentInstallments(student_id: $student_id) {
      id
      study_year
      term_number
      amount
      is_paid
      serial
      createdAt
      updatedAt
      student_id {
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
      academy_term_id {
        id
        serial
        title_ar
        title_en
        status
        study_year
        current_year
        term_number
        min_study_hours
        max_study_hours
      }
      transaction_id {
        id
        serial
        payment_method_type
        source_type
        amount
        payment_document_file
        approval_status
        rejection_reason
        transaction_date
        transaction_serial
        myfatoorah_invoice_id
        myfatoorah_payment_id
        myfatoorah_payment_url
        myfatoorah_transaction_status
        myfatoorah_payment_method
      }
    }
  }
`;


export const PAY_INSTALLMENT = gql`
  mutation PayInstallment($input: PayInstallmentInput!) {
    payInstallment(input: $input) {
      id
      amount
      approval_status
      createdAt
    }
  }
`;

export const FILTERED_PAGED_INSTALLMENTS = gql`
  query FilteredPagedInstallments($search: String, $is_paid: Boolean, $page: Int, $limit: Int) {
    filteredPagedInstallments(search: $search, is_paid: $is_paid, page: $page, limit: $limit) {
      total
      installments {
        id
        study_year
        term_number
        amount
        is_paid
        serial
        createdAt
        updatedAt
        transaction_id {
          id
          serial
          payment_method_type
          source_type
          amount
          payment_document_file
          approval_status
          rejection_reason
          transaction_date
          transaction_serial
          myfatoorah_invoice_id
          myfatoorah_payment_id
          myfatoorah_payment_url
          myfatoorah_transaction_status
          myfatoorah_payment_method
        }
      }
    }
  }
`;

