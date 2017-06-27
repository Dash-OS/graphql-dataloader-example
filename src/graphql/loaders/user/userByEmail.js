import { getUserByEmail } from '../../mock/users';

export default function getLegacyUserByEmailLoader(DLL) {
  return async function batchGetUserByEmail(keys) {
    return keys.map(async key => {
      // not necessary here, but we may pass multiple parameters
      // using an array - so we convert to array so we can pass
      // multiple arguments if needed to our getters.
      if (!Array.isArray(key)) {
        key = [key];
      }
      return getUserByEmail(...key).then(user => {
        if (user.id) {
          // prime the cache incase we call userByID later.  This
          // allows us to cache multiple dataloaders which may request
          // data in different ways but ultimately return the same data.
          DLL.ensure('userByID').prime(user.id, user);
        }
        return user;
      });
    });
  };
}
