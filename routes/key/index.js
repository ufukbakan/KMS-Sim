'use strict'

module.exports = async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {
        return 'Available sub-routes:\n/extend/:key {payload card}\n/delete/:key\n/deleteAll\n/listAll'
    })

    fastify.post('/extend/:key', async function (request, reply) {
        return fastify.extendKey(request.params.key, request.body)
    })

    fastify.get('/delete/:key', async function (request, reply) {
        return fastify.removeKey(request.headers, request.params.key)
    })

    fastify.post('/delete', async function (request, reply) {
        return fastify.removeKey(request.headers, request.body.key)
    })
    
    fastify.get('/deleteAll', async function (request, reply) {
        return fastify.removeAllKeys(request.headers)
    })

    fastify.get('/listAll', async function (request, reply) {
        return fastify.listAllKeys(request.headers)
    })
}