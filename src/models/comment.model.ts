import { DataTypes } from 'sequelize';

import { DefaultModel, modelInitOptions } from './default';
import { CommentAttributes, CommentCreationAttributes } from './typings';

export class Comment
  extends DefaultModel<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes {
  declare body: string;
  declare published_at: Date;
  declare user_id: string;
  declare post_id: string;

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
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    }, modelInitOptions);

    return this;
  }
}

Comment.initialize();
