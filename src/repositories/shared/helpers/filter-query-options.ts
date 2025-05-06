import { defaultOptions } from './default-options.constants';
import { filterOptions } from './filter-options';

export const filterQueryOptions = (
  options,
  nodes = defaultOptions,
) => filterOptions(options, nodes);
