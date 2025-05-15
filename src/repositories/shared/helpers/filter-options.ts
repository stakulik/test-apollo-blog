import { QueryOptions } from '../../typings';

export const filterOptions = (
  source: QueryOptions,
  optionsNodes: string[],
): Record<string, unknown> => {
  const accumulator = {};

  for (const node of optionsNodes) {
    accumulator[node] = source[node];
  }

  return accumulator;
};
