'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const Authentication = require("../../plugins/Authentication");
const KeyStorage = require('../../plugins/KeyStorage');

test('Authentication Service Test', async (t) => {
    const fastify = Fastify()
    fastify.register(Authentication)
    fastify.register(KeyStorage)
    await fastify.ready()

    t.same(await fastify.authenticate({}, [fastify.AuthenticationRoles.READ_WRITE, fastify.AuthenticationRoles.READ_ONLY], () => "I need read permission"),
        {
            status: "FAIL",
            message: "You don't have any token"
        }
    );
})

