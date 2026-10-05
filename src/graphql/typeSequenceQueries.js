import { gql } from "@apollo/client";

// ==========================================
// TypeSequence (Workflow Configuration)
// ==========================================

export const GET_TYPE_SEQUENCES = gql`
  query GetTypeSequences {
      getTypeSequences {
          id
          serial
          arrange
          period_time_per_day
          createdAt
          updatedAt
          SupportTicketTypeId {
              id
              serial
              label_ar
              label_en
              requires_fee
              createdAt
              updatedAt
              fees {
                  id
                  serial
                  title_ar
                  title_en
                  inside_yemen_value
                  outside_yemen_value
                  createdAt
                  updatedAt
                  status
              }
          }
          job_title_id {
              id
              serial
              name_ar
              name_en
              status
              createdAt
              updatedAt
          }
      }
  }
`;

export const GET_TYPE_SEQUENCE_BY_ID = gql`
  query GetTypeSequenceById($id: ID!) {
      getTypeSequenceById(id: $id) {
          id
          serial
          arrange
          period_time_per_day
          createdAt
          updatedAt
          SupportTicketTypeId {
              id
              serial
              label_ar
              label_en
              requires_fee
              createdAt
              updatedAt
          }
          job_title_id {
              id
              serial
              name_ar
              name_en
              status
              createdAt
              updatedAt
          }
      }
  }
`;

export const GET_TYPE_SEQUENCES_BY_TICKET_TYPE = gql`
  query GetTypeSequencesByTicketType($ticketTypeId: ID!) {
      getTypeSequencesByTicketType(ticketTypeId: $ticketTypeId) {
          id
          serial
          arrange
          period_time_per_day
          createdAt
          updatedAt
          SupportTicketTypeId {
              id
              serial
              label_ar
              label_en
              requires_fee
              createdAt
              updatedAt
          }
          job_title_id {
              id
              serial
              name_ar
              name_en
              status
              createdAt
              updatedAt
          }
      }
  }
`;

export const CREATE_TYPE_SEQUENCE = gql`
  mutation CreateTypeSequence($input: CreateTypeSequenceInput!) {
      createTypeSequence(input: $input) {
          id
          serial
          arrange
          period_time_per_day
          createdAt
          updatedAt
          SupportTicketTypeId {
              id
              serial
              label_ar
              label_en
              requires_fee
              createdAt
              updatedAt
          }
          job_title_id {
              id
              serial
              name_ar
              name_en
              status
              createdAt
              updatedAt
          }
      }
  }
`;

export const UPDATE_TYPE_SEQUENCE = gql`
  mutation UpdateTypeSequence($id: ID!, $input: UpdateTypeSequenceInput!) {
      updateTypeSequence(id: $id, input: $input) {
          id
          serial
          arrange
          period_time_per_day
          createdAt
          updatedAt
          job_title_id {
              id
              serial
              name_ar
              name_en
              status
              createdAt
              updatedAt
          }
          SupportTicketTypeId {
              id
              serial
              label_ar
              label_en
              requires_fee
              createdAt
              updatedAt
          }
      }
  }
`;

export const DELETE_TYPE_SEQUENCE = gql`
  mutation DeleteTypeSequence($id: ID!) {
      deleteTypeSequence(id: $id)
  }
`;


// ==========================================
// SupportTicketsSequenceTrans (Ticket Approval History)
// ==========================================

export const GET_SEQUENCE_TRANS = gql`
  query GetSupportTicketsSequenceTrans {
      getSupportTicketsSequenceTrans {
          id
          serial
          is_approved
          approved_datetime
          createdAt
          updatedAt
          support_ticketsId {
              id
              serial
              subject
              message
              type
              status
              admin_reply
              attachment
              admin_attachment
              payment_status
              has_fees
              fee_amount
              createdAt
              updatedAt
          }
          type_sequence_id {
              id
              serial
              arrange
              period_time_per_day
              createdAt
              updatedAt
              SupportTicketTypeId {
                label_ar
                label_en
              }
              job_title_id {
                name_ar
                name_en
              }
          }
          user_id {
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
              signature
              createdAt
              updatedAt
          }
      }
  }
`;

export const GET_SEQUENCE_TRANS_BY_ID = gql`
  query GetSupportTicketsSequenceTransById($id: ID!) {
      getSupportTicketsSequenceTransById(id: $id) {
          id
          serial
          is_approved
          approved_datetime
          createdAt
          updatedAt
          support_ticketsId {
              id
              serial
              subject
              message
              type
              status
              admin_reply
              attachment
              admin_attachment
              payment_status
              has_fees
              fee_amount
              createdAt
              updatedAt
          }
          type_sequence_id {
              id
              serial
              arrange
              period_time_per_day
              createdAt
              updatedAt
              SupportTicketTypeId {
                label_ar
                label_en
              }
              job_title_id {
                name_ar
                name_en
              }
          }
          user_id {
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
              signature
              createdAt
              updatedAt
          }
      }
  }
`;

export const GET_SEQUENCE_TRANS_BY_TICKET = gql`
  query GetSupportTicketsSequenceTransByTicket($ticketId: ID!) {
      getSupportTicketsSequenceTransByTicket(ticketId: $ticketId) {
          id
          serial
          is_approved
          approved_datetime
          createdAt
          updatedAt
          support_ticketsId {
              id
              serial
              subject
              message
              type
              status
              admin_reply
              attachment
              admin_attachment
              payment_status
              has_fees
              fee_amount
              createdAt
              updatedAt
          }
          type_sequence_id {
              id
              serial
              arrange
              period_time_per_day
              createdAt
              updatedAt
              job_title_id {
                  id
                  serial
                  name_ar
                  name_en
                  status
                  createdAt
                  updatedAt
              }
              SupportTicketTypeId {
                  id
                  serial
                  label_ar
                  label_en
                  requires_fee
                  createdAt
                  updatedAt
              }
          }
          user_id {
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
              signature
              createdAt
              updatedAt
          }
      }
  }
`;

export const CREATE_SEQUENCE_TRANS = gql`
  mutation CreateSupportTicketsSequenceTrans($input: CreateSupportTicketsSequenceTransInput!) {
      createSupportTicketsSequenceTrans(input: $input) {
          id
          serial
          is_approved
          approved_datetime
          createdAt
          updatedAt
          user_id {
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
              signature
              createdAt
              updatedAt
          }
          type_sequence_id {
              id
              serial
              arrange
              period_time_per_day
              createdAt
              updatedAt
          }
          support_ticketsId {
              id
              serial
              subject
              message
              type
              status
              admin_reply
              attachment
              admin_attachment
              payment_status
              has_fees
              fee_amount
              createdAt
              updatedAt
          }
      }
  }
`;

export const UPDATE_SEQUENCE_TRANS = gql`
  mutation UpdateSupportTicketsSequenceTrans($id: ID!, $input: UpdateSupportTicketsSequenceTransInput!) {
      updateSupportTicketsSequenceTrans(id: $id, input: $input) {
          id
          serial
          is_approved
          approved_datetime
          createdAt
          updatedAt
          support_ticketsId {
              id
              serial
              subject
              message
              type
              status
              admin_reply
              attachment
              admin_attachment
              payment_status
              has_fees
              fee_amount
              createdAt
              updatedAt
              user_id {
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
                  signature
                  createdAt
                  updatedAt
              }
              ticket_type_id {
                  id
                  serial
                  label_ar
                  label_en
                  requires_fee
                  createdAt
                  updatedAt
                  fees {
                      id
                      serial
                      title_ar
                      title_en
                      inside_yemen_value
                      outside_yemen_value
                      createdAt
                      updatedAt
                      status
                  }
              }
          }
          type_sequence_id {
              id
              serial
              arrange
              period_time_per_day
              createdAt
              updatedAt
              job_title_id {
                  id
                  serial
                  name_ar
                  name_en
                  status
                  createdAt
                  updatedAt
              }
              SupportTicketTypeId {
                  id
                  serial
                  label_ar
                  label_en
                  requires_fee
                  createdAt
                  updatedAt
              }
          }
          user_id {
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
              signature
              createdAt
              updatedAt
          }
      }
  }
`;

export const DELETE_SEQUENCE_TRANS = gql`
  mutation DeleteSupportTicketsSequenceTrans($id: ID!) {
      deleteSupportTicketsSequenceTrans(id: $id)
  }
`;
