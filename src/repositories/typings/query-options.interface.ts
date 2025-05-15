import type { LOCK, Transaction, WhereOptions } from 'sequelize';

export interface QueryOptions {
  limit?: number;
  lock?: LOCK;
  logging?: boolean;
  order?: string[][];
  transaction?: Transaction;
  where?: WhereOptions;
}
