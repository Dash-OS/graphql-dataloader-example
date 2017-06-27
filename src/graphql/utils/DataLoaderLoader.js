/**
 * dataLoader
 *   A request caching layer used per request to reduce database requests
 *   required to resolve a given query.
 *   @ https://github.com/facebook/dataloader
 * @type {import}
 *
 */
import DataLoader from 'dataloader';

/**
 * getCacheKey
 *   This provides a special version of JSON.stringify that
 *   allows us to cache values which normally stringify would
 *   nullify or ignore (other than Symbol).
 *
 *  getCacheKey(() => console.log('hi')) : '"() => console.log('hi')"'
 *
 * @param  {String,Object,Array,Map, Function} key
 * @return {String}
 */
function getDataLoaderLoaderCacheKey(key) {
  return JSON.stringify(key, function(k, v) {
    if (typeof v === 'function') {
      return String(v);
    } else if (v instanceof Map || v instanceof Set) {
      return [...v];
    } else {
      return v;
    }
  });
}

/**
 * DataLoaderLoader
 *   A Simple Wrapper around Facebook's DataLoader which is used
 *   to create and manage a group of DataLoaders by a key and schema.
 */
export default class DataLoaderLoader {
  /**
   * constructor
   * @param  {Object} opts
   *   If options are passed to the construction of the DataLoaderLoader
   *   instance, the given options will be passed to the creation of all
   *   of our DataLoader instances.
   * @param  {Object} schema
   *   Optionally pass loader schemas to initialize with.  This is generally
   *   done by calling DLL.addLoaders(schema) so that we can pass the DLL to
   *   each loader function via a factory.
   * @return {this}
   */
  constructor(opts = Object.create(null), schema = Object.create(null)) {
    this.loaders = new Map();
    this.schema = schema;
    this.opts = opts;
    return this;
  }

  /**
   * .load()
   *   Called to request the .load() on the underlying DataLoader
   *   if it exists.  If it doesn't then it will be created
   *   automatically.
   * @param  {String} loader
   * @param  {Any} key A key representing the values passed to .load function.
   * @return {Promise} Returns the result of the .load() request.
   */
  load = (loader, key, opts) => this.ensure(loader).load(key);

  /**
   * .create()
   *   Creates a new DataLoader.  This is called the first time a given
   *   loader is requested.  Once created, it is used for the life of the
   *   given request.
   * @param  {String} loader
   * @param  {Object} opts
   *   Optionally, any params that are sent to create will be added
   *   to the DataLoader creation options.
   */
  create = (loader, opts) =>
    this.loaders.set(
      loader,
      new DataLoader(this.schema[loader], {
        /**
         * cacheKeyFn
         *   Replaces the default (key => key) to match against
         *   objects to allow us to match arrays, objects, maps,
         *   functions, sets, etc passed to .load
         * @param  {String,Array,Object} key
         * @return {StringifiedKey}
         */
        cacheKeyFn: getDataLoaderLoaderCacheKey,
        // merge in the default and provided opts
        ...this.opts,
        ...opts,
      }),
    );

  /**
   * .get()
   *   get the given loader.  this allows us to run commands against
   *   the underlying DataLoader API (such as .prime())
   * @param  {String} loader
   * @return {DataLoader[loader]}
   */
  get = loader => this.loaders.get(loader);

  /**
   * .addLoaders()
   * @param {Object} loaders Loaders to add to the list of loaders
   * @return {this}
   */
  addLoaders = loaders => {
    this.schema = {
      ...this.schema,
      ...loaders,
    };
    return this;
  };

  /**
   * .ensure()
   *   Similar to get, this will ensure that the given
   *   dataloader exists.  If a loader is requested that does
   *   not yet exist it will be created and the result will
   *   be returned.
   * @param  {String} loader
   * @return {DataLoader[loader]}
   */
  ensure = (loader, opts) => {
    if (!this.loaders.has(loader)) {
      if (!this.schema[loader]) {
        throw new Error(
          `[DataLoaderLoader Error]: Attempted to resolve an unknown loader: ${loader}`,
        );
      } else {
        this.create(loader, opts);
      }
    }
    return this.loaders.get(loader);
  };
}
