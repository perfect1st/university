import { gql } from "@apollo/client";

export const CREATE_REGISTERATION_FORM_TRANSACTION=gql`
mutation CreateTransaction($input:TransactionInput!) {
    createTransaction(input: $input) {
        id
        transaction_date
    }
}

`;

export const GET_ALL_TRANSACTIONS=gql`
query GetTransactions {
    getTransactions {
        id
        serial
        payment_method_type
        amount
        payment_document_file
        transaction_date
        transaction_serial
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

export const GET_FILTERED_TRANSACTIONS=gql`
query GetTransactionsFiltered(
    $limit: Int
    $page: Int
    $operation_type: String
    $search: String
    $payment_method_type: String
    $approval_status: String
) {
    getTransactionsFiltered(
        operation_type: $operation_type
        page: $page
        limit: $limit
        search: $search
        payment_method_type: $payment_method_type
        approval_status: $approval_status
    ) {
        total
        transactions {
            id
            serial
            payment_method_type
            amount
            payment_document_file
            rejection_reason
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
            fees_type_snapshot {
                id
                title_ar
                title_en
                inside_yemen_value
                outside_yemen_value
                status
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
                createdAt
                updatedAt
            }
            register_form_id {
                id
                serial
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
                reviewed_at
                mobile
                home_tel
                email
                is_inside_yemen
                national_id_type
                national_id
                education_year
                study_place
                high_school_student_number
                general_grade
                gpa
                createdAt
                updatedAt
            }
        }
    }
}
`;

export const GET_TRANSACTION_BY_ID=gql`
query GetTransactionById($id:ID!) {
    getTransactionById(id: $id) {
        id
        serial
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
        fees_type_snapshot {
            id
            title_ar
            title_en
            inside_yemen_value
            outside_yemen_value
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
    }
}
`;

export const CREATE_NEW_TRANSACTION_BY_ADMIN=gql`
mutation CreateTransaction($input:TransactionInput!) {
    createTransaction(input: $input) {
        id
        serial
        payment_method_type
        amount
        payment_document_file
        transaction_date
        transaction_serial
    }
}
`;

export const UPDATE_TRANSACTION_BY_ID=gql`
mutation UpdateTransaction($id:ID!,$input:TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
        id
        serial
        payment_method_type
        amount
        payment_document_file
        transaction_date
        transaction_serial
    }
}
`;

export const GET_TRANSACTIONS_BY_USER = gql`
query GetTransactionsByUser($user_id: ID!) {
    getTransactionsByUser(user_id: $user_id) {
        id
        serial
        payment_method_type
        amount
        payment_document_file
        approval_status
        rejection_reason
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
        fees_type_snapshot {
            id
            title_ar
            title_en
            inside_yemen_value
            outside_yemen_value
            status
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
            register_form_id {
                id
                serial
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
                reviewed_at
                mobile
                home_tel
                email
                is_inside_yemen
                national_id_type
                national_id
                education_year
                study_place
                high_school_student_number
                general_grade
                gpa
                createdAt
                updatedAt
            }
        }
    }
}
`;

export const GET_PAYMENT_LOGS_BY_TRANSACTION = gql`
query GetPaymentLogsByTransaction(
    $transaction_id: ID!
    $page: Int
    $limit: Int
) {
    getPaymentLogsByTransaction(
        transaction_id: $transaction_id
        page: $page
        limit: $limit
    ) {
        total
        paymentLogs {
            id
            serial
            action
            payment_date
            payment_method
            amount
            note
            createdAt
            entered_by {
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
    }
}
`;

export const INITIATE_ONLINE_PAYMENT = gql`
mutation InitiateOnlinePayment($input: OnlinePaymentInput!) {
    initiateOnlinePayment(input: $input) {
        paymentUrl
        invoiceId
        transaction {
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
            transaction_type_snapshot {
                id
                title_ar
                title_en
                operation_type
                notes
                status
            }
            fees_type_snapshot {
                id
                title_ar
                title_en
                inside_yemen_value
                outside_yemen_value
                status
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
                createdAt
                updatedAt
            }
            register_form_id {
                id
                serial
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
                reviewed_at
                mobile
                home_tel
                email
                is_inside_yemen
                national_id_type
                national_id
                education_year
                study_place
                high_school_student_number
                general_grade
                gpa
                createdAt
                updatedAt
            }
            admin_reviewed_by {
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
    }
}
`;

export const VERIFY_ONLINE_PAYMENT = gql`
mutation VerifyOnlinePayment($paymentId: String!) {
    verifyOnlinePayment(paymentId: $paymentId) {
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
        transaction_type_snapshot {
            id
            title_ar
            title_en
            operation_type
            notes
            status
        }
        fees_type_snapshot {
            id
            title_ar
            title_en
            inside_yemen_value
            outside_yemen_value
            status
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
            createdAt
            updatedAt
        }
        register_form_id {
            id
            serial
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
            reviewed_at
            mobile
            home_tel
            email
            is_inside_yemen
            national_id_type
            national_id
            education_year
            study_place
            high_school_student_number
            general_grade
            gpa
            createdAt
            updatedAt
        }
    }
}
`;