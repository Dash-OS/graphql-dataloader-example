const USERS = [
  {
    id: 'user1',
    email: 'one@email.com',
    firstName: 'Joe',
    lastName: 'Peterson',
    friends: ['user2', 'user3'],
  },
  {
    id: 'user2',
    email: 'two@email.com',
    firstName: 'Mike',
    friends: ['user1', 'user3'],
  },
  {
    id: 'user3',
    email: 'three@email.com',
    firstName: 'Barula',
    lastName: 'Jeofforson',
    friends: ['user1', 'user2'],
  },
];

export async function getUserByID(id) {
  console.log('Getting User By ID: ', id);
  for (const user of USERS) {
    if (user.id === id) {
      return { ...user };
    }
  }
}

export async function getUserByEmail(email) {
  console.log('Getting User By Email: ', email);
  for (const user of USERS) {
    if (user.email === email) {
      return { ...user };
    }
  }
}
