'use strict';

module.exports = {

  up: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'provider'),
      queryInterface.removeColumn('appoitments', 'canceled_at')
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'provider',
        {
          type: Sequelize.BOOLEAN
        }
      ),
      queryInterface.addColumn(
        'appoitments',
        'canceled_at',
        {
          type: Sequelize.DATE
        }
      ),
    ]);
  }
};
