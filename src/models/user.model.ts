import { DataTypes } from 'sequelize';

import { DefaultModel, modelInitOptions } from './default';
import { UserAttributes, UserCreationAttributes } from './typings';

export class User
  extends DefaultModel<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare email: string;
  declare nickname: string;
  declare password: string;

  static initialize() {
    this.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, modelInitOptions);

    return this;
  }
}

User.initialize();
