import { graphql, GraphQLSchema } from 'graphql';

import { Query } from './root';

import dataLoaderFactory from './loaders';

import { NormalUser } from './types/UserType';

// http://graphql.org/graphql-js/type/#graphqlschema
const schema = new GraphQLSchema({
  query: Query,
  types: [NormalUser],
  // mutation: Mutation
});

export default function runGraphQL(evt) {
  /* Run our GraphQL Query against our schema and
     return a promise that will resolve to the final result. */

  let { query } = evt;
  const { root, variables } = evt;
  /* Handle the initial introspection of GraphiQL for auto completion and
     handling https://github.com/graphql/graphiql */
  if (evt && evt.query && evt.query.query) {
    query = event.query.query.replace('\n', ' ', 'g');
  }

  /*
    Dataloader is used to cache requests for specifics things.
    However, since our requests may be highly dynamic, we need
    to dynamically build our loaders as our request is being
    processed.  This works almost like a dataloader for dataloders.

    We pass it through as context so that our resolvers can use it
    throughout the request regardless of how deep the request becomes.
   */
  const context = {
    // returns a DataLoaderLoader with our loaders.
    loader: dataLoaderFactory(),
  };

  /* http://graphql.org/graphql-js/graphql/#graphql */
  return graphql(schema, query, root, context, variables).catch(err => {
    console.error(`[ GRAPHQL ERROR ]: ${err.message}`);
    return null;
  });
}
