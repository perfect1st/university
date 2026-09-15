import { gql } from "@apollo/client";

export const GET_STUDENT_INSTALLMENTS = gql`
  query GetStudentInstallments($studentId: ID!) {
    getStudentInstallments(student_id: $studentId) {
      id
      study_year
      term_number
      amount
      is_paid
      createdAt
      academy_term_id {
        title_ar
        title_en
      }
      transaction_id {
        id
        amount
        approval_status
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

