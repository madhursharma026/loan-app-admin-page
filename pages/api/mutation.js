import { gql } from '@apollo/client';

export const FIRST_STEP_ADMIN_LOGIN = gql`
mutation firstStepAdminLogin($firstStepLoginInput: FirstStepLoginInput!) {
    firstStepAdminLogin(firstStepLoginInput: $firstStepLoginInput) {
      id
    }
}
`;

export const ADMIN_LOGIN_VERIFICATION = gql`
mutation AdminLoginVerification($loginVerificationInput: LoginVerificationInput!) {
    adminLoginVerification(loginVerificationInput: $loginVerificationInput) {
      jwtToken
      refreshToken
    }
}
`;

