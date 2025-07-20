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
  declare moderated_at: Date;

  static initialize() {
    this.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('clock_timestamp()'),
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      moderated_at: {
        type: DataTypes.DATE,
      },
    }, modelInitOptions);

    return this;
  }
}

Post.initialize();
