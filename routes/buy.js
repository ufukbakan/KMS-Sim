'use strict'

const { default: fp } = require("fastify-plugin")

async function router(fastify, opts){

    fastify.post('/buy/:productId', async function (request, reply) {
        return fastify.buyKey(Number(request.params.productId), request.body)
    })
}

module.exports = fp(router)