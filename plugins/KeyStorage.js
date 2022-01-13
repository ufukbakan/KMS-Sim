'use strict'

const fp = require('fastify-plugin')
const { Pool } = require("pg")
const pool = new Pool()

const PurchaseStatus = {
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL'
}
Object.freeze(PurchaseStatus);

function KeyStorageService(fastify, opts, done) {

    function pickRandomAlphaNumericCharacter() {
        let bin = Math.round(Math.random())
        if (bin == 0) {   //return alphabetic
            return String.fromCharCode(Math.round(Math.random() * 25 + 65))
        }
        else {   //return numeric
            return String.fromCharCode(Math.round(Math.random() * 9 + 48))
        }
    }

    async function getProduct(pid) {
        let query = {
            text: "select name, price from products where id=$1",
            values: [pid]
        }
        try {
            const response = await pool.query(query)
            if (response.rowCount < 1) {
                return undefined;
            }
            else {
                return (response.rows[0])
            }
        }
        catch (err) {
            logQueryError(query, err)
            return undefined
        }
    }

    async function getProductIdByKey(key) {
        let query = {
            text: "select related_product from keys where key=$1",
            values: [key]
        }
        try {
            const response = await pool.query(query)
            if (response.rowCount < 1) {
                return undefined;
            }
            else {
                return (response.rows[0]['related_product'])
            }
        }
        catch (err) {
            logQueryError(query, err)
            return undefined
        }
    }

    async function doesKeyExist(key) {
        let query = {
            text: "select * from keys where key=$1",
            values: [key]
        }
        try {
            let result = await pool.query(query)
            if (result.rowCount <= 0)
                return false
            else
                return true
        }
        catch (err) { // if an error occurs, calls itself again
            logQueryError(query, err)
            return undefined
        }
    }

    async function generateKey() {
        let keyExists = true
        let key = ""
        while (keyExists == true) {
            key = ""
            for (let i = 1; i <= 16; i++) {
                key += pickRandomAlphaNumericCharacter()
                if (i % 4 == 0 && i != 16)
                    key += "-"
            }
            keyExists = await doesKeyExist(key)
        }
        if (keyExists == false) {
            return key
        } else/*keyExists is undefined here since it breaked the while loop its not false*/ {
            return false
        }
    }

    function getNextYearsDate() {
        let nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)
        return nextYear
    }

    async function insertKeyToDB(key, pid) {
        let query = {
            text: "insert into keys values($1,$2,$3)",
            values: [key, pid, getNextYearsDate()]
        }
        try {
            await pool.query(query)
            return true
        }
        catch (err) {
            logQueryError(query, err)
            return false
        }
    }

    function logQueryError(query, err) {
        fastify.log.error("Couldn't execute query: " + JSON.stringify(query))
        fastify.log.warn(err.message)
    }

    function toPaymentInfoObject(card, ...products) {
        return {
            card: card,
            cart: [...products]
        }
    }

    function getValidPurchaseResultObject(key, product) {
        return {
            message: "You've successfully bought key for " + product.name,
            purchaseStatus: PurchaseStatus.SUCCESS,
            key: key,
            cost: "$" + product.price
        }
    }

    async function buyKey(productId, cardInformation) {
        let product = await getProduct(productId)
        if (product) {
            if (fastify.isPaymentMethodValid(cardInformation)) {
                let key = await generateKey()
                if (key) {
                    if (fastify.chargePayment(toPaymentInfoObject(cardInformation, product))) {
                        insertKeyToDB(key, productId)
                        return getValidPurchaseResultObject(key, product)
                    }
                    else {
                        return getInvalidPurchaseResultObject("Payment is rejected")
                    }
                }
                else {
                    return getInvalidPurchaseResultObject("Sorry, we are not able to generate keys right now")
                }
            }
            else {
                return getInvalidPurchaseResultObject("Invalid payment method")
            }
        }
        else {
            return getInvalidPurchaseResultObject("Product doesn't exist with id " + productId)
        }
    }

    async function removeKey(key) {
        await pool.query("delete from keys where key=$1", [key]).then((response) => {
            if (response.rowCount > 0) {
                fastify.log.info("Key removed (" + key + ")")
            } else {
                throw new Error("Key doesn't exist already")
            }
        })
    }

    async function removeAllKeys(key) {
        await pool.query("delete from keys").then((response) => {
            if (response.rowCount > 0) {
                fastify.log.info(response.rowCount + " keys removed")
            } else {
                throw new Error("There are already no keys")
            }
        })
    }

    async function listAllKeys() {
        return (await pool.query("select * from keys")).rows
    }

    function getInvalidPurchaseResultObject(message) {
        return {
            message: message,
            purchaseStatus: PurchaseStatus.FAIL,
            //key: undefined,
            //cost: undefined
        }
    }

    async function didKeyExpire(key) {
        let query = {
            text: "select * from keys where key=$1 and expiration_date<$2",
            values: [key, new Date()]
        }
        let result = undefined

        await pool.query(query).then(response => {
            if (response.rowCount == 1)
                result = true
            else
                result = false
        }).catch(err => logQueryError(query, err))
        return result
    }

    async function extendKey(key, card) {
        if (await didKeyExpire(key)) {
            if (fastify.isPaymentMethodValid(card)) {
                let extendedProduct = await getProduct(await getProductIdByKey(key))
                extendedProduct.price /= 2 // 50% discount
                if (fastify.chargePayment(toPaymentInfoObject(card, extendedProduct))) {
                    extendKeyforaYear(key)
                    return getValidPurchaseResultObject(key, extendedProduct)
                } else {
                    return getInvalidPurchaseResultObject("Payment is rejected")
                }
            }
            else {
                return getInvalidPurchaseResultObject("Invalid payment method")
            }
        }
        else {
            return getInvalidPurchaseResultObject("Your key doesn't exist or has not expired yet")
        }
    }

    async function extendKeyforaYear(key) {
        let query = {
            text: "update keys set expiration_date=$2 where key=$1",
            values: [key, getNextYearsDate()]
        }
        pool.query(query).catch(err => logQueryError(query, err))
    }

    async function activateProduct(productId, key) {
        let query = {
            text: "select * from keys where key=$1",
            values: [key]
        }
        try{
            let response = await pool.query(query)
            if (response.rowCount < 1 || response.rows[0]['related_product'] != productId) {
                return { message: "Your key is invalid for this product" }
            }
            let expired = await didKeyExpire(key)
            if (expired == undefined) {
                return { message: "Sorry our servers can't check your key's status. Please try again later." }
            } else if (expired) {
                return { message: "Your key is expired" }
            } else {
                return { message: "You've successfully activated your product" }
            }
        }
        catch(err){
            logQueryError(query,err)
            return { message: "Sorry our servers can't check your key's status. Please try again later." }
        }
    }

    fastify.decorate('buyKey', (productId, cardInformation) => buyKey(productId, cardInformation))
    fastify.decorate('extendKey', (key, cardInformation) => extendKey(key, cardInformation))
    fastify.decorate('removeKey', (headers, key) => fastify.authenticate(headers, fastify.AuthenticationRoles.READ_WRITE, removeKey, key))
    fastify.decorate('removeAllKeys', (headers) => fastify.authenticate(headers, fastify.AuthenticationRoles.READ_WRITE, removeAllKeys))
    fastify.decorate('listAllKeys', (headers) => fastify.authenticate(headers, [fastify.AuthenticationRoles.READ_WRITE, fastify.AuthenticationRoles.READ_ONLY], listAllKeys))
    fastify.decorate('activateProduct', (productId, key) => activateProduct(productId, key))
    fastify.decorate('dbPool', pool)

    done()
}

module.exports = fp(KeyStorageService)