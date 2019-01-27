'use strict'

const path = require('path')
const { ApolloServer, gql } = require('apollo-server')
const { createResolver } = require('..')

const typeDefs = gql`
  type Book {
    slug: String!
    title: String!
    author: String!
  }

  type Query {
    getBook(slug: String!): Book
  }
`

const getBook = createResolver({
  basePath: path.join(__dirname, '..', 'src', 'test-fixtures', 'fixtures'),
  argsToPath: ({ slug }) => `${slug}.json`,
})

const resolvers = {
  Query: {
    getBook,
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

;(async () => {
  const { url } = await server.listen()
  console.log(`🚀  Server ready at ${url}`)
})()
