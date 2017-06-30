import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLList,
} from 'graphql';

const getCommonUserFields = () => ({
  id: {
    type: new GraphQLNonNull(GraphQLString),
    description: "The user's unique ID",
  },
  email: {
    type: new GraphQLNonNull(GraphQLString),
    description: "The user's email address",
  },
  firstName: {
    type: GraphQLString,
    description: "The user's first name",
  },
  lastName: {
    type: GraphQLString,
    description: "The user's last name",
  },
  fullName: {
    type: GraphQLString,
    description: "The user's full name",
    resolve({ firstName, lastName }) {
      console.log('Resolve Full');
      if (!firstName && !lastName) {
        return null;
      }
      return `${firstName}${lastName && ` ${lastName}`}`;
    },
  },
  friends: {
    type: new GraphQLList(User),
    description: 'Friends of the given User',
    resolve({ friends = [] }, args, { loader }) {
      return loader.ensure('userByID').loadMany(friends);
    },
  },
});

/*  A User is an Interface which may represent multiple
    levels and associations to a specific user.
*/
const User = new GraphQLInterfaceType({
  name: 'UserInterface',
  description: 'A User of a Given Type',
  fields: () => getCommonUserFields(),
  resolveType(/* user */) {
    // Once we want to allow querying of multiple user types we
    // can add them here, returning the appropriate user.
    return NormalUser;
  },
});

const NormalUser = new GraphQLObjectType({
  name: 'NormalUser',
  description: 'A normal registered user without priviledges',
  interfaces: [User],
  fields: () => ({
    ...getCommonUserFields(),
    // any extra fields for normal users here
  }),
});

export { User, NormalUser };
