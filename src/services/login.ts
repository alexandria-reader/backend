import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import userData from '../data-access/users';
import { UserDB } from '../types';


const verifyLoginDetails = async function (email: string, password: string): Promise<UserDB> {
  const result = await userData.getUserByEmail(email);

  if (result.rowCount > 0) {
    const user: UserDB = result.rows[0];
    const passwordsMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordsMatch) {
      return user;
    }

    throw boom.notAcceptable('Passwords do not match');
  }

  throw boom.notAcceptable('Email not found');
};

export default {
  verifyLoginDetails,
};
