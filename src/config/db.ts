import { default as appConfig } from './app';

const { database } = appConfig;

const sslOptions = database.sslOff
  ? {}
  : {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };

const { poolMax } = database;

const commonConfig = {
  url: database.url,
  dialect: 'postgres',
  dialectOptions: sslOptions,
  logging: false,
  benchmark: true,
  pool: {
    max: poolMax,
    min: 0,
    idle: 10000,
  },
};

const development = commonConfig;
const test = commonConfig;
const production = commonConfig;

export {
  development, test, production,
};
