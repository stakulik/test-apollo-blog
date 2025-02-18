import { DataTypes, Sequelize } from 'sequelize';

import { DefaultModel, modelInitOptions } from './default';
import { CommentAttributes, CommentCreationAttributes } from './typings';

export class Comment
  extends DefaultModel<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes {
  declare body: string;
  declare published_at: Date;
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

Comment.initialize();
