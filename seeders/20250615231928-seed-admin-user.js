'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      email: 'admin@ufc.br',
      password: '$2b$10$cJE98XVMSsEPmlheA7zyH.RID.CJjNgVqWNL.NvecL4YCF7HclA0O', // senha: admin123
      name: 'Administrador',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { email: 'admin@ufc.br' }, {});
  }
};
