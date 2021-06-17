const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getProfile', 'updateKYC']);
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'getContracts', 'manageContracts']);

module.exports = {
  roles,
  roleRights,
};
