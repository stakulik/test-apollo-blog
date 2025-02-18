import { DataTypes, Sequelize } from 'sequelize';

import { DefaultModel, modelInitOptions } from './default';
import { PostAttributes, PostCreationAttributes } from './typings';

export class Post
  extends DefaultModel<PostAttributes, PostCreationAttributes>
  implements PostAttributes {
  declare body: string;
  declare published_at: Date;
  declare title: string;
  declare user_id: string;

  static initialize() {
    this.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('clock_timestamp()'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('clock_timestamp()'),
      },
    }, modelInitOptions);

    return this;
  }
}

Post.initialize();
