import { createBatchResolver } from 'graphql-resolve-batch';

export function batchResolver(asyncResolver) {
  return createBatchResolver((resolverParams) => asyncResolver([...resolverParams]));
}
