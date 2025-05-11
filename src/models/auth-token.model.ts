import { DataTypes } from 'sequelize';

import { DefaultModel, modelInitOptions } from './default';
import { AuthTokenAttributes, AuthTokenCreationAttributes } from './typings';

export class AuthToken
  extends DefaultModel<AuthTokenAttributes, AuthTokenCreationAttributes>
  implements AuthTokenAttributes {
  declare token: string;
  declare user_id: string;

  static initialize() {
    this.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    }, modelInitOptions);

    return this;
  }
}

AuthToken.initialize();
