import { generateJWT } from '../../src/services';
import { User } from '../../src/models';

export const buildExecutionContext = (
  user: User | null,
  requestObject: Record<string, unknown>,
): Record<string, unknown> => {
  return {
    userData: { user },
    req: requestObject,
  };
};

export const buildOutcomeCursor = (payload: Record<string, unknown>): string => (
  Buffer.from(JSON.stringify(payload), 'utf8').toString('base64')
);

export const buildRequestObject = (token: string): Record<string, unknown> => {
  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
};

export const executeServerOperation = async (
  server,
  query: string,
  variables: Record<string, unknown> = {},
  context: Record<string, unknown> = {},
) => {
  return server.executeOperation(
    {
      query,
      variables,
    },
    {
      contextValue: context,
    },
  );
};

export const generateToken = (user: User): string => generateJWT({ user_data: { email: user.email } });
