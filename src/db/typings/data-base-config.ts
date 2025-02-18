import { EnvironmentConfig } from './environment-config';

export type DataBaseConfig = {
  development: EnvironmentConfig;
  test: EnvironmentConfig;
  production: EnvironmentConfig;
};
