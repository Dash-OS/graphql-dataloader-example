/**
 * Our loaders allow us to create batch requests for data
 * so that we do not need to make wasteful requests of our
 * database and functions.
 *
 * Loaders use Facebook's DataLoader to cache and return promises
 * for each key and to batch our requests over a single requests
 * so that we only need to make a simple request.
 *
 * Each loader will receive an array of keys to request and expects
 * a matching array of values to respond with.
 *
 * @ https://github.com/facebook/dataloader
 */
import DataLoaderLoader from '../utils/DataLoaderLoader';

import getUserByIDLoader from './user/userByID';
import getUserByEmailLoader from './user/userByEmail';

/**
 * dataLoaderFactory
 *   When our request begins it calls the factory to
 *   request a new DataLoaderLoader instance.  This
 *   instance will include our default loaders within
 *   it's schema allowing us make requests of it by the
 *   loaders keyID.
 *
 *   Our DataLoaders will only be created and used when
 *   specifically requested during the lifecycle of our
 *   request, allowing us to dynamically grow our loaders
 *   based on the given request.
 *
 *   The factory is important as it allows our loaders to
 *   access each other if needed to allow for priming and
 *   sharing values when necessary.
 *    @ https://github.com/facebook/dataloader#primekey-value
 *
 * @return {DataLoaderLoader} The requests DataLoaderLoader instance.
 */
export default function dataLoaderFactory() {
  const DLL = new DataLoaderLoader();

  const loaders = {
    userByID: getUserByIDLoader(DLL),
    userByEmail: getUserByEmailLoader(DLL),
  };

  return DLL.addLoaders(loaders);
}
