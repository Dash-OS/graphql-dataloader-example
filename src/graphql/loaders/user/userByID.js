import { getUserByID } from '../../mock/users';

export default function getLegacyUserByIDLoader(DLL) {
  return async function batchGetUserByID(keys) {
    return keys.map(async key => {
      // not necessary here, but we may pass multiple parameters
      // using an array - so we convert to array so we can pass
      // multiple arguments if needed to our getters.
      if (!Array.isArray(key)) {
        key = [key];
      }
      return getUserByID(...key).then(user => {
        if (user.email) {
          // prime the cache incase we call userByEmail later.  This
          // allows us to cache multiple dataloaders which may request
          // data in different ways but ultimately return the same data.
          DLL.ensure('userByEmail').prime(user.email, user);
        }
        return user;
      });
    });
  };
}
