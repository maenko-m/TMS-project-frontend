import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($input: UserCreateInput!) {
    createUser(input: $input)
  }
`;
