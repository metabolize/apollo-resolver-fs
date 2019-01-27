'use strict'

const fs = require('fs')
const path = require('path')
const chai = require('chai')
const { ApolloServer } = require('apollo-server')
const { request } = require('graphql-request')
const { argsToPath, typeDefs } = require('./test-fixtures/defs')
const { createResolver } = require('./fs-resolver')

const { expect } = chai
chai.use(require('chai-as-promised'))

const fixtureDir = path.join(__dirname, 'test-fixtures', 'fixtures')

let server
let url
before(async function() {
  const getBook = createResolver({
    basePath: fixtureDir,
    argsToPath,
  })
  const resolvers = { Query: { getBook } }
  server = new ApolloServer({ typeDefs, resolvers })
  ;({ url } = await server.listen())
})

after(async function() {
  server.stop()
  server = undefined
})

async function requestBook(slug) {
  return request(
    url,
    `
      query GetExampleBook($slug: String!) {
        getBook(slug: $slug) {
          title,
          author
        }
      }
    `,
    { slug }
  )
}

context('When an item exists', function() {
  it('The client can fetch it from the server', async function() {
    const { title, author, slug } = JSON.parse(
      fs.readFileSync(path.join(fixtureDir, 'harry-potter.json'))
    )

    const data = await requestBook(slug)

    const expected = { getBook: { title, author } }
    expect(data).to.deep.equal(expected)
  })
})

context('When an item does not exist', function() {
  it('The expected error is returned', async function() {
    await expect(requestBook('this-one-does-not-exist')).to.be.rejectedWith(
      'Not found'
    )
  })
})
