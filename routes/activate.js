'use strict'

const { default: fp } = require("fastify-plugin")

async function router(fastify, opts){

    fastify.get('/activate/:productId/:key', async function (request, reply) {
        return fastify.activateProduct(Number(request.params.productId), request.params.key)
    })
}

module.exports = fp(router)