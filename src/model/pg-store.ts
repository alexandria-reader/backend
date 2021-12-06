import dbQuery from './db-query';

export default {

  async getUsers() {
    const FIND_ALL_USERS = 'SELECT * FROM users';
    const result = await dbQuery(FIND_ALL_USERS);
    return result.rows;
  },

};
