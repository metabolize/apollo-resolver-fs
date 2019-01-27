# apollo-resolver-fs

[![version](https://img.shields.io/npm/v/apollo-resolver-fs.svg?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/apollo-resolver-fs.svg?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/metabolize/apollo-resolver-fs.svg?style=flat-square)][build]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][prettier]

[npm]: https://npmjs.com/apollo-resolver-fs/
[build]: https://circleci.com/gh/metabolize/apollo-resolver-fs/tree/master
[prettier]: https://prettier.io/

A resolver function for [Apollo Server][] which loads serialized data from
local files. Designed as a companion to [apollo-resolver-gcs][] for local
testing.

Based on the example server in the Apollo Server 2 [Getting Started][] guide.

[apollo-resolver-gcs]: https://github.com/metabolize/apollo-resolver-gcs
[apollo server]: https://www.apollographql.com/docs/apollo-server/
[getting started]: https://www.apollographql.com/docs/apollo-server/getting-started.html

## Usage

```js
const { ApolloServer } = require('apollo-server')
const { createResolver } = require('apollo-resolver-fs')

const typeDefs = ...

const getBook = createResolver({
  basePath: '/path/to/the/data',
  argsToKey: ({ slug }) => `${slug}.json`,
})

const resolvers = {
  Query: {
    getBook,
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

await server.listen()
```

In this example, `getBook(slug: "harry-potter")` returns the deserialized
contents of `/path/to/the/data/harry-pottern.json`.

## Running the example server

1. Run `npm start` to start the server.
2. Open `https://localhost:4000/`. You should see the GraphQL Playground
   explorer tool.
3. Run a query:

```gql
{
  getBook(slug: "harry-potter") {
    title
    author
  }
}
```

You should see the result:

```json
{
  "data": {
    "getBook": {
      "title": "Harry Potter and the Chamber of Secrets",
      "author": "J.K. Rowling"
    }
  }
}
```

## License

This project is licensed under the MIT license.
