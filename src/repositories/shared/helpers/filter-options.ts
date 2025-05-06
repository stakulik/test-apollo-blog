export const filterOptions = (source, optionsNodes) => {
  const accumulator = {};

  for (const node of optionsNodes) {
    accumulator[node] = source[node];
  }

  return accumulator;
};
