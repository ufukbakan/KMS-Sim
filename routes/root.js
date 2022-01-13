'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return "Welcome to the KMS server. Available routes:\n/buy/:product_id (payload credit card)\n/activate/:product_id/:key\n/key";
    //return { root: true }
  })
}
