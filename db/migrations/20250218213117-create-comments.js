module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('comments', {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },
        body: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        published_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'users',
              schema: 'public',
            },
            key: 'id',
          },
          allowNull: false,
        },
        post_id: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'posts',
              schema: 'public',
            },
            key: 'id',
          },
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('clock_timestamp()'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('clock_timestamp()'),
        },
      });

      await queryInterface.addIndex('comments', ['user_id']);

      await queryInterface.addIndex('comments', ['post_id']);
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comments');
  }
};
