import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
} from 'graphql';

import { User } from './types/UserType';

const delayPromised = delay =>
  new Promise(resolve => setTimeout(resolve, delay));

// http://graphql.org/graphql-js/object-types/
export const Query = new GraphQLObjectType({
  name: 'ExampleGraphQL',
  description: 'Root Query Schema',
  fields: () => ({
    user: {
      type: User,
      description: 'Query a user using the available arguments.',
      args: {
        id: {
          type: GraphQLString,
          description: 'Query a user by their userID',
        },
        email: {
          type: GraphQLString,
          description: 'Query a user by their email',
        },
        prime: {
          type: GraphQLBoolean,
          description:
            'Await a short timeout to allow other requests to prime our cache',
        },
      },
      resolve: async (root, { id, email, prime }, { loader }) => {
        console.log('Resolving: ', id, email, prime);
        if (prime) {
          await delayPromised();
        }
        if (!id && !email) {
          return null;
        }
        let promise;
        if (id) {
          return loader.load('userByID', id);
        } else if (email) {
          return loader.load('userByEmail', email);
        }
      },
    },
  }),
});
