import { gql } from "@apollo/client";

export const GET_ALL_BACKUPS = gql`
query Backups($page: Int, $limit: Int, $status: String, $type: String) {
    backups(page: $page, limit: $limit, status: $status, type: $type) {
        total
        backups {
            id
            filename
            filePath
            fileSize
            status
            type
            errorMessage
            note
            downloadUrl
            createdAt
            updatedAt
            performedBy {
                id
                username
                fullname
                email
        }
        }
    }
}
`;

export const GET_BACKUP_BY_ID = gql`
query Backup($id: ID!) {
    backup(id: $id) {
        id
        filename
        filePath
        fileSize
        status
        type
        errorMessage
        note
        downloadUrl
        createdAt
        updatedAt
        performedBy {
                id
                username
                fullname
                email
        }
    }
}
`;

export const CREATE_BACKUP = gql`
mutation CreateManualBackup($note: String!) {
    createManualBackup(note: $note) {
        id
        filename
        filePath
        fileSize
        status
        type
        errorMessage
        note
        downloadUrl
        createdAt
        updatedAt
    }
}
`;

export const DELETE_BACKUP = gql`
mutation DeleteBackup($id: ID!) {
    deleteBackup(id: $id)
}
`;
