module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auth_tokens', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      token: {
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('auth_tokens');
  }
};
