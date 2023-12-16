'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Todos', 'userId', {
      type: Sequelize.INTEGER, // type為必要屬性，故此處應該要寫與原先相同的屬性
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Todos', 'userId', {
      type: Sequelize.INTEGER, // type為必要屬性，故此處應該要寫與原先相同的屬性
      allowNull: true
    })
  }
};
