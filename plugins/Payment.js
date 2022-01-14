'use strict'

const fp = require("fastify-plugin")

function PaymentService(fastify, opts, done) {

    function cardDidntExpire(expirationDate) {
        let monthnyear = expirationDate.split("/")
        if (monthnyear.length != 2 || monthnyear[0].length != 2 || monthnyear[1].length != 2) {
            return false
        }
        let expirationDateObj = new Date(monthnyear[0] + ".01." + monthnyear[1])
        if (!isValidDate(expirationDateObj)) {
            return false
        }
        if (expirationDateObj > new Date()) {
            return true
        }
        return false
    }

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    function validateCardFields(card) {
        if (card.number
            && card.expirationDate
            && card.CVC
            && String(card.number).match(/^[0-9]{16}$/)
            && cardDidntExpire(card.expirationDate)
            && String(card.CVC).match(/^[0-9]{3}$/)) {
            return true
        }
        return false
    }

    function isPaymentMethodValid(card) {
        if (card
            && validateCardFields(card)) {
            return true
        }
        return false
    }

    function chargePayment(paymentInfo) {
        // paymentInfo.card is credit/debit card
        // paymentInfo.cart is list of products
        if (paymentInfo.card.number[0] == 0) {
            return false
        }
        fastify.log.info("************"+paymentInfo.card.number.substr(paymentInfo.card.number.length-4,4) + " charged $" + calculateSum(paymentInfo.cart) + " for " + JSON.stringify(paymentInfo.cart.map(p => p.name)))
        return true
    }

    function calculateSum(products) {
        return products.map(p => p.price).reduce((prev, next) => prev.price + next.price)
    }

    fastify.decorate("isPaymentMethodValid", (paymentInfo) => isPaymentMethodValid(paymentInfo))
    fastify.decorate("chargePayment", (paymentInfo) => chargePayment(paymentInfo))
    done()
}

module.exports = fp(PaymentService)