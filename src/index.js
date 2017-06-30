import runQuery from './graphql';

// Queries the same user twice, shows .prime() used to cache
// against both id and email.  Each query runs in parallel so
// our cache will not pick up right away (we will query the user twice here),
// but when we query friends of friends - they will be cached.
//
// Our end result is a total of 4 requests rather than around +-14.
const exampleQueryOne = `
  query {
    queryOne: user(id: "user1") {
      id
      email
      friends {
        email
        friends {
          email
        }
      }
    }
    queryTwo: user(email: "one@email.com") {
      id
      email
      friends {
        email
        friends {
          email
        }
      }
    }
  }
`;

// What if we wanted to sacrific a bit of parallelism in exchange for
// less database requests?
//
// In order for this to work, we need to slightly delay the execution
// of our second query so that the first query has time to prime the cache.
//
// In actual requests, we would likely need to make this a bit more robust
// since a request could take a variable amount of time.  Probably by passing
// a promise to the second queries context that the first will resolve.
//
// In this example we make a total of 3 requests - one time for each user
// rather than +-14!
const exampleQueryTwo = `
  query {
    queryOne: user(id: "user1") {
      id
      email
      friends {
        email
        friends {
          email
        }
      }
    }
    queryTwo: user(email: "one@email.com", prime: true) {
      id
      email
      friends {
        email
        friends {
          email
        }
      }
    }
  }
`;

// eslint-disable-next-line
function runExampleQueryOne() {
  // Each individual request has it's own cache.
  return runQuery({
    query: exampleQueryOne,
    // eslint-disable-next-line
  }).then(result => {
    console.log('Result of Query One:');
    console.log(JSON.stringify(result, null, 2));
  });
}

function runExampleQueryTwo() {
  return runQuery({
    query: exampleQueryTwo,
    // eslint-disable-next-line
  }).then(result => {
    console.log('Result of Query Two:');
    console.log(JSON.stringify(result, null, 2));
  });
}

runExampleQueryTwo();
