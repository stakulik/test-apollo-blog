import { QueryOptions } from '../../typings';

import { defaultOptions } from './default-options.constants';
import { filterOptions } from './filter-options';

export const filterQueryOptions = (
  options: QueryOptions,
  nodes: string[] = defaultOptions,
): Record<string, unknown> => filterOptions(options, nodes);
