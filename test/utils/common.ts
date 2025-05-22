import _ from 'lodash';

export const omitFields = (
  fields: Record<string, unknown>,
  extraFields: string[],
): Record<string, unknown> => (
  _.omit(fields, extraFields)
);

export const omitCommonAttributes = (
  record: Record<string, unknown>,
  fields: string[] = [],
): Record<string, unknown> => omitFields(
  record,
  [
    'id',
    'created_at',
    'updated_at',
    ...fields,
  ],
);
