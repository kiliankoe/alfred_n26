#! /usr/local/bin/node

const N26 = require('n26')
const fs = require('fs')
const moment = require('moment')
const formatCurrency = require("format-currency")

moment.locale('de-DE')

const auth = JSON.parse(fs.readFileSync('./auth.json', 'utf8'))

// TODO: Check if auth is broken (or not setup yet) and
// prompt user to enter details which are then saved to auth.json

// const args = process.argv.slice(2)
// const searchString = args[0].length > 1 ? args : ''

const myAccount = new N26(auth.username, auth.password)
  .then(account => account.transactions() // {text: 'searchString'}
  .then(transactions => transactions.map(createItem)))
  .then(toAlfred)
  .then(JSON.stringify)
  .then(console.log)


function createItem(transaction) {
  let name = ''
  if (transaction.merchantName !== undefined) name = transaction.merchantName
  else if (transaction.partnerName !== undefined) name = `${transaction.partnerName}: ${transaction.referenceText}`

  return {
    'title': `${formatMoneyAmount(transaction.amount, transaction.currencyCode)} ${name}`,
    'subtitle': moment(transaction.createdTS).format('dddd, Do MMMM YYYY, HH:mm [Uhr]')
  }
}

function formatMoneyAmount(amount, identifier) {
  let currencySymbol = substituteCurrencySymbol(identifier)
  let opts = { format: '%v%s', symbol: '€', locale: 'de-DE' }
  return formatCurrency(amount, opts)
}

function substituteCurrencySymbol(identifier) {
  if (identifier === "EUR") return "€"
  if (identifier === "USD") return "$"
  if (identifier === "GBP") return "£"
  else return identifier
}

function toAlfred(items) {
  return {
    'items': items
  }
}
