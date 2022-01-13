'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const KeyStorage = require("../../plugins/KeyStorage");
const Authentication = require('../../plugins/Authentication');

test('Key Storage Service Test', async (t) => {
  const fastify = Fastify()
  fastify.register(KeyStorage)
  fastify.register(Authentication)

  await fastify.ready()

  t.same(await fastify.listAllKeys(),
    {
      status: "FAIL",
      message: "You don't have any token"
    }
  );

  //t.same(fastify.generateKey(), /^([A-Z0-9]{4}-){3}[A-Z0-9]{4}$/)
})

