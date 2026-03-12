import { gql } from "@apollo/client";

export const GET_ALL_USERES_FOR_ADMIN = gql`
query Users {
    users {
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
        birthdate
        gender
        national_id_type
        national_id
        address
        home_tel
        register_form_id {
            id
            first_name
            second_name
            third_name
            fourth_name
            faculty_department_id {
                id
            }
            faculty_id {
                id
            }
        }
        createdAt
        updatedAt
    }
}
`;

export const CREATE_USER_BY_ADMIN = gql`
mutation CreateUser($input: AdminCreateUserInput!) {
    createUser(input: $input) {
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
`;

export const UPDATE_USER_BY_ADMIN = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      username
      fullname
      email
      mobile
      role
      status
      groups {
        id
        name_ar
        name_en
      }
      updatedAt
    }
  }
`;

export const FILTERED_USERS = gql`
  query FilteredPagedUsers(
    $limit: Int
    $page: Int
    $status: Boolean
    $role: String
    $search: String
  ) {
    filteredPagedUsers(
      limit: $limit
      page: $page
      status: $status
      role: $role
      search: $search
    ) {
      total
      users {
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
              groups {
            id
            name_ar
            name_en
        }
      }
    }
  }
`;
export const MY_NOTIFICATIONS = gql`
query GetMyNotifications {
    getMyNotifications {
        id
        title_ar
        title_en
        body_ar
        body_en
        is_read
        createdAt
        updatedAt
    }
}
`;
export const MY_UNREAD_NOTIFICATIONS = gql`
query GetMyUnreadNotificationsCount {
    getMyUnreadNotificationsCount
}
`;

export const MARK_NOTIFICATION_AS_READ = gql`
 mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
        id
        title_ar
        title_en
        body_ar
        body_en
        is_read
        createdAt
        updatedAt
    }
}
`;
export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
 mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
}
`;

export const GET_STUDENTS_BY_FACULTY_DEPARTMENT = gql`
query StudentsByFacultyDepartment($faculty_department_id: ID!) {
    studentsByFacultyDepartment(faculty_department_id: $faculty_department_id) {
        id
        first_name
        second_name
        third_name
        fourth_name
        birthdate
        gender
        address
        status
        mobile
        createdAt
        updatedAt
        email
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
            is_inside_yemen
            createdAt
            updatedAt
        }
    }
}
`;