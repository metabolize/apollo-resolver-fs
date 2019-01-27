'use strict'

const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const { UserInputError } = require('apollo-server')

const readFile = promisify(fs.readFile)

// transform: async (contents, metadata) => result
function createResolver({
  basePath = '',
  argsToPath,
  transform = contents => JSON.parse(contents),
}) {
  return async function resolver(parent, args, context, info) {
    const filename = path.join(basePath, argsToPath(args))
    let contents
    try {
      contents = await readFile(filename)
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new UserInputError('Not found')
      } else {
        throw e
      }
    }
    const result = await transform(contents)
    return result
  }
}

module.exports = { createResolver }
