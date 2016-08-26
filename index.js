#! /usr/local/bin/node

const N26 = require('n26')
const fs = require('fs')

const auth = JSON.parse(fs.readFileSync('./auth.json', 'utf8'))

const myAccount = new N26(auth.username, auth.password)
  .then(account => account.transactions() // {text: 'searchstring'}
  .then(transactions => {
    let items = transactions.map(createItem)
    console.log(JSON.stringify(toAlfred(items)))
  }))

function createItem(transaction) {
  let name = ''
  if (transaction.merchantName !== undefined) name = transaction.merchantName
  else if (transaction.partnerName !== undefined) name = transaction.partnerName

  return {
    'title': `${transaction.amount}${substituteCurrencySymbol(transaction.currencyCode)} ${name}`,
    'subtitle': transaction.createdTS
  }
}

function substituteCurrencySymbol(identifier) {
  if (identifier === "EUR") return "€"
  if (identifier === "USD") return "$"
  else return identifier
}

function toAlfred(items) {
  return {
    'items': items
  }
}
