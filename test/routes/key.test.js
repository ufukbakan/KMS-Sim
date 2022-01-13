'use strict'

const tap = require('tap');
const { build } = require("../helper")

tap.test("Key route test", (t)=>{
    t.plan(1) // for not synchronized callbacks plan test count before the test
    
    const app = build(t)

    app.inject({
        url: "/key"
    }).then(res=>{
        t.match(res.payload, 'Available sub-routes:\n/extend/:key {payload card}\n/delete/:key\n/deleteAll\n/listAll')
    })

});