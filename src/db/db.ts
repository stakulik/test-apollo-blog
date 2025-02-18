import { omit } from 'lodash';
import { Sequelize } from 'sequelize';

import * as configDB from '../config/db';

import { DataBaseConfig, Environment } from './typings';

const nodeEnv = (process.env.NODE_ENV as Environment) || 'development';

const configDbForEnv = (configDB as DataBaseConfig)[nodeEnv];
const sequelizeOptions = omit(configDbForEnv, ['url']);

const sequelize = new Sequelize(configDbForEnv.url, {
  ...sequelizeOptions,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export {
  sequelize,
  Sequelize,
};
