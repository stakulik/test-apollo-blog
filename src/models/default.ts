import { Model, CreationOptional } from 'sequelize';

import { sequelize } from '../db';

import { DefaultAttributes } from './typings';

export class DefaultModel<A extends object, CA extends object>
  extends Model<A, CA>
  implements DefaultAttributes {
  declare id: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export const modelInitOptions = {
  sequelize,
};
