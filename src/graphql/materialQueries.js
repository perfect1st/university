import { gql } from "@apollo/client";

export const GET_ALL_MATERIALS = gql`
query Materials {
    materials {
        id
        title_ar
        title_en
        status
        fullmark_degree
        success_degree
        material_hours
        doctor_id {
                id
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
        createdAt
        updatedAt
        faculty_department_id {
            id
            title_ar
            title_en
            status
            createdAt
            updatedAt
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
        }
    }
}
`;

export const CREATE_NEW_MATERIAL = gql`
mutation CreateMaterial($input:MaterialInput!) {
    createMaterial(input: $input) {
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
`;

export const UPDATE_MATERIAL_BY_ID = gql`
mutation UpdateMaterial($id:ID!,$input:MaterialInput!) {
    updateMaterial(id: $id, input: $input) {
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
`;


export const GET_MATERIALS_BY_DEPARTMENT_ID = gql`
query MaterialsByDepartment($faculty_department_id:ID!) {
    materialsByDepartment(faculty_department_id: $faculty_department_id) {
        id
        title_ar
        title_en
        status
        fullmark_degree
        success_degree
        material_hours
        doctor_id {
                id
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
        createdAt
        updatedAt
    }
}
`;

export const GET_ALL_FILTERED_MATERIALS = gql`
query FilteredPagedMaterials(
    $limit: Int!
    $page: Int!
    $status: Boolean
    $search: String
    $faculty_department_id: ID
    ) {
    filteredPagedMaterials(
        search: $search
        faculty_department_id: $faculty_department_id
        status: $status
        page: $page
        limit: $limit
    ) {
        total
        materials {
            id
            title_ar
            title_en
            status
            fullmark_degree
            success_degree
            material_hours
              doctor_id {
                id
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
            createdAt
            updatedAt
            faculty_department_id {
                id
                title_ar
                title_en
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
               
                status
                createdAt
                updatedAt
            }
        }
    }
}
`;

export const GET_MATERIALS_BY_DOCTOR=gql`
query MaterialsByDoctor($doctor_id:ID!) {
    materialsByDoctor(doctor_id: $doctor_id) {
        id
        title_ar
        title_en
        status
        fullmark_degree
        success_degree
        material_hours
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
        doctor_id {
            id
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
`;