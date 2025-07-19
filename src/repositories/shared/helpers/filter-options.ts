import { QueryOptions } from '../../typings';

export const filterOptions = (
  source: QueryOptions,
  optionsNodes: string[],
): Record<string, unknown> => {
  const accumulator = {};

  if (!source) {
    return accumulator;
  }

  for (const node of optionsNodes) {
    if (Object.prototype.hasOwnProperty.call(source, node)) {
      accumulator[node] = source[node];
    }
  }

  return accumulator;
};
