module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('posts', {
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
          defaultValue: Sequelize.literal('clock_timestamp()'),
        },
        title: {
          type: Sequelize.STRING,
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

      await queryInterface.addIndex('posts', ['user_id']);

      await queryInterface.addIndex('posts', ['published_at']);
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('posts');
  }
};
