import { gql } from '@apollo/client';

export const FETCH_ADMIN_DETAILS = gql`
query admin($mobileNumber: String!) {
  admin(mobileNumber: $mobileNumber) {
    id
    mobileNumber
    status
    createdAt
    updatedAt
  }
}
`;

export const FETCH_USERS_DETAILS = gql`
query Users {
  users {
    id
    mobileNumber
    status
    createdAt
    updatedAt
  }
}
`;

