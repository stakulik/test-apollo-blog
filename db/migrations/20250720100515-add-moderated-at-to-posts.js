module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'moderated_at', {
      type: Sequelize.DATE,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('posts', 'moderated_at');
  },
};
